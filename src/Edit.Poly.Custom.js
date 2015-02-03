L.Edit = L.Edit || {};

L.Edit.Poly.include({
	enableShape : function() {
		var markerType;
		this._markerGroup.eachLayer(function (marker) {
			if (marker) {
				markerType = marker.options && marker.options.type ?
											marker.options.type : undefined;
				//L.setOptions(marker, {draggable: true});
				marker.dragging.enable();
				marker.setOpacity(markerType === 'middleMarker' ? 0.6 : 1);
			}
		});
		this.shapeDisabled = false;

		return this;
	},

	disableShape : function() {
		this._markerGroup.eachLayer(function (marker) {
			if (marker) {
				//L.setOptions(marker, {draggable: false});
				marker.setOpacity(0);
				marker.dragging.disable();
			}
		});
		this.shapeDisabled = true;

		return this;
	},

	_createMarker: function (latlng, index, options) {
		options = options || {};
		var marker = new L.Marker(latlng, L.extend({
			draggable: !this.shapeDisabled,
			icon: this.options.icon
		}, options));

		marker._origLatLng = latlng;
		marker._index = index;

		marker.on('drag', this._onMarkerDrag, this);
		marker.on('dragend', this._fireEdit, this);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_createMiddleMarker: function (marker1, marker2) {
		var latlng = this._getMiddleLatLng(marker1, marker2),
		    marker = this._createMarker(latlng, null, {type : 'middleMarker'}),
		    onClick,
		    onDragStart,
		    onDragEnd;

		marker.setOpacity(0.6);

		marker1._middleRight = marker2._middleLeft = marker;

		onDragStart = function () {
			var i = marker2._index;

			marker._index = i;

			marker
			    .off('click', onClick, this)
			    .on('click', this._onMarkerClick, this);

			latlng.lat = marker.getLatLng().lat;
			latlng.lng = marker.getLatLng().lng;
			this._poly.spliceLatLngs(i, 0, latlng);
			this._markers.splice(i, 0, marker);

			marker.setOpacity(1);

			this._updateIndexes(i, 1);
			marker2._index++;
			this._updatePrevNext(marker1, marker);
			this._updatePrevNext(marker, marker2);

			this._poly.fire('editstart');
		};

		onDragEnd = function () {
			marker.off('dragstart', onDragStart, this);
			marker.off('dragend', onDragEnd, this);

			this._createMiddleMarker(marker1, marker);
			this._createMiddleMarker(marker, marker2);
		};

		onClick = function () {
			onDragStart.call(this);
			onDragEnd.call(this);
			this._fireEdit();
		};

		marker
		    .on('click', onClick, this)
		    .on('dragstart', onDragStart, this)
		    .on('dragend', onDragEnd, this);

		this._markerGroup.addLayer(marker);
	},

  _onStopDragFeature: function(evt) {
  	var polygon = this._poly;
    for (var i = 0, len = polygon._latlngs.length; i < len; i++) {
      // update marker
      var marker = this._markers[i];
      marker.setLatLng(polygon._latlngs[i]);

      // this one's needed to update the path
      marker._origLatLng = polygon._latlngs[i];
      if (marker._middleLeft) {
        marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
      }
      if (marker._middleRight) {
        marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
      }
    }

    // show vertices
    this._poly._map.addLayer(this._markerGroup);
    if(this.shapeDisabled) {
    	this.disableShape();
    } else {
    	this.enableShape();
    }
    this._fireEdit();
  }
});