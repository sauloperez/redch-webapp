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
    // Remove server-side sync
    Backbone.sync = function() { return true };
  },

  process: function(msg) {
    switch (msg.action) {
      case 'add':
        return this.createFromMessage(msg);
        break;
      case 'delete':
        return this.removeFromMessage(msg);
        break;
      default:
        throw new Error("Invalid message action");
    }
  },

  createFromMessage: function(msg) {
    return this.create(new Redch.Models.Observation(msg));
  },

  removeFromMessage: function(msg) {
    delete msg.action;
    var obs = this.findWhere(msg);
    this.remove(obs);
  }
});
