// Server communication abstraction
// -------------------

// It forwards all the underlying API events to the application
// event aggregator (or event bus). It is intended to decouple
// the specific WebSockets/ServerSentEvents implementations
// from the actual use.

var Communicator = function(options) {
  if (!options || !options.eventBus) {
    throw new Error("eventBus not specified");
  }

  var defaults = {
    port: 8080,
    hostname: window.document.location.hostname
  }

  options || (options = {});
  _.defaults(options, defaults);

  this.uri = options.uri;
  if (!options.uri) {
    var scheme = "http://";
    this.uri = scheme + options.hostname + ":" + options.port;
  }

  this.namespace = "communicator";
  this.eventBus = options.eventBus;

  // Make the config accessible
  this.config = _.extend({}, options);

  this.initialize.apply(this, arguments);
};

$.extend(Communicator.prototype, Backbone.Events, {

  initialize: function() {},

  parse: function(data) {
    return JSON.parse(data);
  },

  connect: function () {
    var self = this,
        conn = new EventSource(this.uri);

    conn.onerror = function(e) {
      self.onError.call(self, e);
    }
    conn.onmessage = function(e) {
      self.onMessage.call(self, e);
    };
    conn.onopen = function(e) {
      self.onOpen.call(self, e);
    };
  },

  onError: function(error) {
    this.eventBus.trigger(this.namespace + ":error", error);
  },

  onMessage: function(e) {
    this.eventBus.trigger(this.namespace + ":message", this.parse(e.data));
  },

  onOpen: function(e) {
    this.eventBus.trigger(this.namespace + ":open", e);
  }
});
