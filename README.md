# leaflet-custom-poly-drag
A customized version of leaflet poly drag, a wrapper of Leaflet.Draw.Drag plugin

##Install##
Run ```npm install --save-dev leaflet-custom-draw-drag``` to install and meanwhile put this plugin to your app's `devDependencies` in your `package.json`

##Example of Usage##
Call `polygon.editing.disableShape()` to disable the resize shape features, e.g.
``` javascript
var polygon = new L.Polygon([
  [51.51, -0.1],
  [51.5, -0.06],
  [51.52, -0.03]
]);
polygon.editing.enable();
map.addLayer(polygon);
polygon.editing.disableShape(); //disable resize shape feature, and put opacity: 0 on resize markers
//polygon.editing.enableShape(); //this would enable resizeshape, and restore opacity value for markers
```
