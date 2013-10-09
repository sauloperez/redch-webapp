$(function() {
  'use strict';

  window.Redch = {};

  var map = Redch.map = L.map('map').setView([41.66471, 2.10938], 8)

  L.tileLayer('http://{s}.tile.cloudmade.com/9346c049ef8342d9916bdc1a0d64d73f/998/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      minZoom: 8
  }).addTo(map);

  // Initialize the SVG layer
  map._initPathRoot();

  var svg = d3.select(map.getPanes().overlayPane).select("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");

  d3.json("data.json", function(collection) {
    collection = collection.values;
    var bounds = d3.geo.bounds(collection);

    var project = function(p) {
      return map.latLngToLayerPoint(p);
    };

    // Relocate the overlaying SVG shapes
    var resetOverlay = function() {
      g.selectAll("circle")
        .attr("cx", function(d) { return project(d.LatLng).x; })
        .attr("cy", function(d) { return project(d.LatLng).y; });
    };


    // Add a LatLng object to each item in the dataset
    collection.forEach(function(d) {
      d.LatLng = new L.LatLng(d.lat,d.lng);
    });

    var feature = g.selectAll("circle")
      .data(collection)
    .enter()
      .append("circle")
      .style("fill", function(d) {
        var d = d.value;
        var returnColor;
        if (d > 0.2) returnColor = "red";
        else if (d > 0.1) returnColor = "orange";
        else returnColor = "yellow";
        return returnColor;
      })
      .attr("r", function (d) { return d.value * 20; })
      .attr("cx", function(d) { return project(d.LatLng).x; })
      .attr("cy", function(d) { return project(d.LatLng).y; });

    map.on("viewreset", resetOverlay);
  });


  // WEBSOCKETS
  Redch.WS = {};

  Redch.WS.scheme = "ws://";
  Redch.WS.port = 8080;
  Redch.WS.uri = Redch.WS.scheme + window.document.location.hostname + ":" + Redch.WS.port;

  var ws = Redch.WS.connection = new WebSocket(Redch.WS.uri);

  // Log errors
  ws.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
  };

  ws.onmessage = function(e) {
    // var data = JSON.parse(e.data);
    console.log(e.data);
  };

  ws.onopen = function(e) {
    console.log('WebSocket connection open to ' + Redch.WS.uri);
    ws.send('hello');
  };
});
