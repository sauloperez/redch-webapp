// Visualization
// -----------------

// Contains all the stuff to show the map and its overlaid draws

var Visualization = function(options) {
  if (options && !options.collection) {
    throw new Error('collection not specified');
  }

  if (options && !options.mapId) {
    throw new Error('map id not specified');
  }

  var defaults = {
    center: [41.82749, 1.60584], // Geoprahic center of Catalonia
    zoomLevel: 8
  };

  options || (options = {});

  _.defaults(options, defaults);

  this.center = options.center;
  this.zoomLevel = options.zoomLevel;
  this.collection = options.collection;
  this.mapId = options.mapId;

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
     this.map = L.mapbox.map('map', this.mapId).setView(this.center, this.zoomLevel);
  },

  projectPoint: function(x, y) {
    var point = this.map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  },

  // Relocate the overlaying SVG shapes
  resetOverlay: function(g) {
    var self = this;
    g.selectAll("circle")
      .attr("cx", function(d) {
        return self.project(d.get('LatLng')).x;
      })
      .attr("cy", function(d) {
        return self.project(d.get('LatLng')).y;
      });
  },

  draw: function() {
    var self = this,
        feature = this._g
                        .selectAll("circle")
                        .data(this.collection.models),
        color = d3.scale
                    .linear()
                    .domain([0, 10])
                    .range(['yellow', 'red']);

    var projection = d3.geo.transform({ point: this.projectPoint });

    // Update circles that are still present
    feature.transition().duration(200).style("fill", function(model) {
      return color(model.get('value'));
    });

    // Create new circles
    feature.enter()
      .append("circle")
      .style("fill", function(model) {
        return color(model.get('value'));
      })
      .style("fill-opacity", 0.75)
      .attr("cx", function(d) {
        // return self.project(d.get('LatLng')).x;
        var point = d.get('LatLng');
        return projection(point.lat.toString(), point.lng.toString())[0];
      })
      .attr("cy", function(d) {
        // return self.project(d.get('LatLng')).y;
        var point = d.get('LatLng');
        return projection(point.lat.toString(), point.lng.toString())[1];
      })
     .attr("r",0).transition().duration(100).attr("r",function(d) {
       return (self.map.getZoom() / 1.25);
     });

    // Remove old circles
    feature.exit()
      .transition().duration(250).attr("r",0).remove();
  }

});
