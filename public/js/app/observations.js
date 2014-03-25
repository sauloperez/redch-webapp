// Namespace
var Redch = window.Redch = {
  Collections: {},
  Models: {}
};

Redch.Models.Observation = Backbone.Model.extend({});

Redch.Collections.Observations = Backbone.Collection.extend({
  model: Redch.Models.Observation,
  url: '',

  initialize: function() {
    // Disable server-side sync
    Backbone.sync = function() { return true; };
  },

  process: function(msg) {
    switch (msg.action) {
      case 'ADD':
        return this.createFromMessage(msg);
        break;
      case 'DELETE':
        return this.removeFromMessage(msg);
        break;
      default:
        throw new Error('Invalid message action');
    }
  },

  createFromMessage: function(msg) {
    var logMessage = 'Added',
        obs = new Redch.Models.Observation(msg),
        oldObs = this.findWhere({ sensorId: obs.get('sensorId') });

    if (oldObs) {
      _.extend(oldObs.attributes, obs.attributes);
      logMessage = 'Updated';
    }
    else {
      this.add(obs);
    }

    console.log(logMessage + ' observation #' + obs.get('id') + ' from sensor #' + obs.get('sensorId'));

    return obs;
  },

  removeFromMessage: function(msg) {
    var obs = this.find(function(model) {
      return model.get('sensorId') == msg.sensorId;
    });
 
    if (obs) {
      this.remove(obs);
      console.log('Removed observation #' + obs.get('id') + ' from sensor #' + obs.get('sensorId'));
    }
  }
});
