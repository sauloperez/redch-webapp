// Visualization
// -----------------

// Contains all the stuff to show the map and its overlaid draws

var Visualization = function(options) {
  if (options && !options.collection) {
    throw new Error("collection not specified");
  }

  var defaults = {
    center: [41.82749, 1.60584],
    zoomLevel: 8
  }

  options || (options = {});

  _.defaults(options, defaults);

  this.center = options.center;
  this.zoomLevel = options.zoomLevel;
  this.collection = options.collection;

  this.initialize.apply(this);
};

$.extend(Visualization.prototype, Backbone.Events, {

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
          .data(this.collection.models);

    feature.enter()
      .append("circle")
      .style("fill", function(model) {
        var d = model.get('value');
        var returnColor;
        if (d >= 0.2) returnColor = "red";
        else if (d >= 0.1) returnColor = "orange";
        else if (d >= 0.05) returnColor = "yellow";
        else returnColor = "green";
        return returnColor;
      })
      .style("fill-opacity", 0.5)
      .attr("cx", function(d) { 
        return self.project(d.get('LatLng')).x; 
      })
      .attr("cy", function(d) { 
        return self.project(d.get('LatLng')).y; 
      })
      .attr("r",0).transition().duration(100).attr("r",function(d) {
        return self.map.getZoom() * 2 * d.get('value');
      });

    feature.exit()
      .transition().duration(250).attr("r",0).remove();
  }

});
