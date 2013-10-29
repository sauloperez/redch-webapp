$(function() {
  'use strict';

  var Redch = window.Redch = {
    Collections: {},
    Models: {}
  };

  Redch.Models.Observation = Backbone.Model.extend({});
  Redch.Collections.Observations = Backbone.Collection.extend({
    model: Redch.Models.Observation
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

  // Store each observation received
  Redch.on("communicator:message", function(msg) {
    msg.action = "add";
    msg.LatLng = new L.LatLng(msg.coord[0], msg.coord[1]);

    var observation = new Redch.Models.Observation(msg);
    
    switch(observation.get('action')) {
      case "add":
        Redch.observations.add(observation);
        break;
      case "delete":
        Redch.observations.remove(observation);
        break;
    }
    
  });
});
