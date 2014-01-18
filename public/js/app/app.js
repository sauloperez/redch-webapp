(function() {
  'use strict';

  // Initial Setup
  // -------------

  // Namespace
  var Redch = window.Redch = {
    Collections: {},
    Models: {}
  };

  // Models and Collections
  Redch.Models.Observation = Backbone.Model.extend({});
  Redch.Collections.Observations = Backbone.Collection.extend({
    model: Redch.Models.Observation,

    createFromMessage: function(msg) {
      this.create(new Redch.Models.Observation(msg));
    },

    removeFromMessage: function(msg) {
      this.remove(new Redch.Models.Observation(msg));
    }
  });

  // Let the global Redch object serve as a global event bus
  $.extend(Redch, Backbone.Events);

  // Set up the observations collections
  Redch.observations = new Redch.Collections.Observations();

  var onUpdate = function() {
    Redch.visualization.draw();
  };

  Redch.observations.on("add", onUpdate);
  Redch.observations.on("remove", onUpdate);

  // Map Visualization
  Redch.visualization = new Visualization({
    collection: Redch.observations
  });

  // Server communication
  Redch.communicator = new Communicator({
    eventBus: Redch,
    uri: '/stream'
  });
  Redch.communicator.connect();

  // Visualize each observation received
  Redch.on("communicator:message", function(msg) {

    // TODO send the proper action from the SOS
    msg.action = "add";
    msg.LatLng = new L.LatLng(msg.coord[0], msg.coord[1]);

    switch(observation.get('action')) {
      case "add":
        Redch.observations.createFromMessage(msg);
        break;
      case "delete":
        Redch.observations.removeFromMessage(observation);
        break;
    }

  });
})();
