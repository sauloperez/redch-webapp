$(function() {
  'use strict';

  var Redch = window.Redch = {};

  // Let the global Redch object serve as a global event bus
  $.extend(Redch, Events);

  Redch.collection = [];
  Redch.collectionIndex = 0;

  // Map Visualization
  Redch.visualization = new Visualization({
    collection: Redch.collection
  });

  // WebSocket handling
  Redch.WS = new WSAdapter({ eventBus: Redch });
  Redch.WS.connect();

  Redch.on("ws:message", function(data) {
    var msg = JSON.parse(data),
        i = Redch.collectionIndex;

    msg.LatLng = new L.LatLng(msg.lat, msg.lng);

    console.log(msg);

    Redch.collection[i] = msg;
    Redch.visualization.draw();

    Redch.collectionIndex++;
  });
});
