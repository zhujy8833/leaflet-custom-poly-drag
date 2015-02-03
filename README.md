# leaflet-custom-poly-drag
A customized version of leaflet poly drag, a wrapper of Leaflet.Draw.Drag plugin

##Install##
```npm install --save-dev leaflet-custom-draw-drag```

##How to load/import##
You can simply use ```require('leaflet-custom-draw-drag')```

You can load this plugin in your app using `browserify`: https://github.com/substack/node-browserify. If you use ES6 in your ember app, you can put 

```import CustomLeafletDrag from 'npm:leaflet-custom-draw-drag'; ```, which should make you be able to use the plugin.

##Example##
Here is one example of how to use this plugin to disable shape markers when load the polygon:
``` javascript 
var polygon = new L.Polygon([
  [51.51, -0.1],
  [51.5, -0.06],
  [51.52, -0.03]
]);
polygon.editing.enable();
map.addLayer(polygon);
polygon.editing.disableShape(); //disable shaping feature
```


