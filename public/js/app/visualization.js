// Visualization
// -----------------

// Contains all the stuff to show the map and its overlay draws

var Visualization = function(options) {
  if (options && !options.collection) {
    throw new Error("collection not specified");
  }

  options || (options = {});

  this.center = options.center || [41.73509, 1.51498];
  this.zoomLevel = options.zoomLevel || 8;
  this.collection = options.collection;

  this.initialize.apply(this);
};

$.extend(Visualization.prototype, Events, {

  initialize: function() {
    this.setupMap();

    // Initialize the SVG layer
    this.map._initPathRoot();

    var svg = d3.select(this.map.getPanes().overlayPane).select("svg");
    this._g = svg.append("g").attr("class", "leaflet-zoom-hide");

    // Scale the visualization
    this.map.on("viewreset", function() { this.resetOverlay(this._g); }, this);
  },

  setupMap: function() {
     this.map = L.map('map').setView(this.center, this.zoomLevel);

    L.tileLayer('http://{s}.tile.cloudmade.com/9346c049ef8342d9916bdc1a0d64d73f/998/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      minZoom: this.zoomLevel
    }).addTo(this.map);
  },

  project: function(p) {
    return this.map.latLngToLayerPoint(p);
  },

  // Relocate the overlaying SVG shapes
  resetOverlay: function(g) {
    var self = this;
    g.selectAll("circle")
      .attr("cx", function(d) { return self.project(d.LatLng).x; })
      .attr("cy", function(d) { return self.project(d.LatLng).y; });
  },

  draw: function() {
    var self = this,
        feature = this._g.selectAll("circle")
          .data(this.collection);

    feature.enter()
      .append("circle")
      .style("fill", function(d) {
        var d = d.value;
        var returnColor;
        if (d > 0.75) returnColor = "red";
        else if (d > 0.50) returnColor = "orange";
        else if (d > 0.25) returnColor = "yellow";
        else returnColor = "green";
        return returnColor;
      })
      .style("fill-opacity", 0.5)
      .attr("cx", function(d) { return self.project(d.LatLng).x; })
      .attr("cy", function(d) { return self.project(d.LatLng).y; })
      .attr("r",0).transition().duration(100).attr("r",function(d) {
        return self.map.getZoom() * 2 * d.value;
      });

    feature.exit()
      .transition().duration(250).attr("r",0).remove();
  }

});
