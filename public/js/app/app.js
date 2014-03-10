(function() {
  'use strict';

  // Initial Setup
  // -------------

  // Let the global Redch object serve as a global event bus
  $.extend(Redch, Backbone.Events);

  // MapBox map id to request for
  // black example: examples.map-y7l23tes
  Redch.mapId = 'sauloperez.hec01k4e';

  // Set up the observations collections
  Redch.observations = new Redch.Collections.Observations();

  // Paint the visualization on each observation addition or removal
  var onUpdate = function() {
    Redch.visualization.draw();
  };

  Redch.observations.on("add", onUpdate);
  Redch.observations.on("remove", onUpdate);

  // Map Visualization
  Redch.visualization = new Visualization({
    collection: Redch.observations,
    mapId: Redch.mapId
  });

  // Server communication
  Redch.communicator = new Communicator({
    eventBus: Redch,
    uri: '/stream'
  });
  Redch.communicator.connect();

  // Visualize each observation received
  Redch.on("communicator:message", function(msg) {
    msg.LatLng = new L.LatLng(msg.coord[0], msg.coord[1]);
    Redch.observations.process(msg);
  });
})();
