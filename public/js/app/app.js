$(function() {
  'use strict';

  var Redch = window.Redch = {};

  // Let the global Redch object serve as a global event bus
  $.extend(Redch, Events);

  Redch.collection = [];
  Redch.collectionIndex = 0;

  var map = Redch.map = L.map('map').setView([41.66471, 2.10938], 8)

  L.tileLayer('http://{s}.tile.cloudmade.com/9346c049ef8342d9916bdc1a0d64d73f/998/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      minZoom: 8
  }).addTo(map);

  // Initialize the SVG layer
  map._initPathRoot();

  var svg = d3.select(map.getPanes().overlayPane).select("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");

  var project = function(p) {
    return map.latLngToLayerPoint(p);
  };

  // Relocate the overlaying SVG shapes
  var resetOverlay = function() {
    g.selectAll("circle")
      .attr("cx", function(d) { return project(d.LatLng).x; })
      .attr("cy", function(d) { return project(d.LatLng).y; });
  };

  Redch.draw = function(collection) {
    var feature = g.selectAll("circle")
      .data(collection);

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
      .attr("cx", function(d) { return project(d.LatLng).x; })
      .attr("cy", function(d) { return project(d.LatLng).y; })
      .attr("r",0).transition().duration(100).attr("r",function(d) {
        return map.getZoom() * 2 * d.value;
      });

    feature.exit()
      .transition().duration(250).attr("r",0).remove();

    map.on("viewreset", resetOverlay);
  };


  /*
   * WebSocket handling
   */
  Redch.WS = new WSAdapter({ eventBus: Redch });
  Redch.WS.connect();

  Redch.on("ws:message", function(data) {
    var msg = JSON.parse(data),
        i = Redch.collectionIndex;

    msg.LatLng = new L.LatLng(msg.lat, msg.lng);

    console.log(msg);

    Redch.collection[i] = msg;
    Redch.draw(Redch.collection);

    Redch.collectionIndex++;
  });
});
