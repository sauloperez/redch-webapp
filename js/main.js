(function() {
  var map;

  function initialize() {
    var mapEl = document.getElementById('map-canvas'),
        mapOptions = {
          zoom: 8,
          center: new google.maps.LatLng(41.66471, 2.10938),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles:[{"stylers": [{"saturation": -75},{"lightness": 50}]}]
        };
    map = new google.maps.Map(mapEl,
        mapOptions);

    // Load the station data. When the data comes back, create an overlay.
    d3.json("data.json", function(data) {
      var overlay = new google.maps.OverlayView();

      // Add the container when the overlay is added to the map.
      overlay.onAdd = function() {
        var overlayProjection = this.getProjection(),
            layer = d3.select(this.getPanes().overlayLayer)
                      .append("div")
                      .attr("class", "circles");
            // svg = layer.append("svg")
            //               .attr("width", mapEl.offsetWidth)
            //               .attr("height", mapEl.offsetHeight)

        // Draw each marker as a separate SVG element
        overlay.draw = function() {

          function transform(d) {
            d = new google.maps.LatLng(d.lat, d.lng);
            d = overlayProjection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .style("left", d.x + "px")
                .style("top", d.y + "px");
          }

          var circleContainers = layer.selectAll("svg")
            .data(data.values)
            .each(transform) // update existing
          .enter()
            .append("svg")
            .each(transform)
            .attr("class", "circle-container");

          // Add circles
          circleContainers.append("circle")
            .attr("cx", 50)
            .attr("cy", 50)
            .attr("r", function (d) {
              return d.value * 30;
            })
            .style("fill", function(d) {
              var d = d.value;
              var returnColor;
              if (d > 0.2) returnColor = "red";
              else if (d > 0.1) returnColor = "orange";
              else returnColor = "yellow";
              return returnColor;
            });
        };
      };

      // Bind our overlay to the map…
      overlay.setMap(map);
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);
})();
