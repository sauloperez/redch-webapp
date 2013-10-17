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

  // Server communication
  Redch.communicator = new Communicator({ 
    eventBus: Redch,
    uri: '/stream' 
  });
  Redch.communicator.connect();

  Redch.on("communicator:message", function(msg) {
    console.log("Received: " + msg);

    var i = Redch.collectionIndex;

    msg.LatLng = new L.LatLng(msg.lat, msg.lng);

    Redch.collection[i] = msg;
    Redch.visualization.draw();

    Redch.collectionIndex++;
  });
});
