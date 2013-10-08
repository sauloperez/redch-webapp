$(function() {
  var map = L.map('map').setView([41.66471, 2.10938], 8)

  L.tileLayer('http://{s}.tile.cloudmade.com/9346c049ef8342d9916bdc1a0d64d73f/998/256/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
  }).addTo(map);

  // Initialize the SVG layer
  map._initPathRoot();

  var svg = d3.select(map.getPanes().overlayPane).select("svg"),
      g = svg.append("g");

  d3.json("data.json", function(collection) {
    collection = collection.values;
    // Add a LatLng object to each item in the dataset
    collection.forEach(function(d) {
      d.LatLng = new L.LatLng(d.lat,d.lng);
    });

    var feature = svg.selectAll("circle")
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
      .attr("r", function (d) {
              return d.value * 30;
            })
      .attr("cx", function(d) {
        return map.latLngToLayerPoint(d.LatLng).x;
      })
      .attr("cy", function(d) {
        return map.latLngToLayerPoint(d.LatLng).y;
      });
  });
});
