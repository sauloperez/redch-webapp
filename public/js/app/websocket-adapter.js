// WebSocket Adapter
// -------------------

// It forwards all WebSocket events to the application
// event aggregator (or event bus). The intention of
// this is to decouple the specific websockets implementation
// from the application's use of it.

var WSAdapter = function(options) {
  if (options && !options.eventBus) {
    throw new Error("eventBus not specified");
  }

  var scheme = "ws://";
  var port = 8080;
  var uri = scheme + window.document.location.hostname + ":" + port;

  this.uri = options.uri || uri;
  this.eventBus = options.eventBus;

  this.initialize.apply(this);
};

$.extend(WSAdapter.prototype, Events, {

  initialize: function() {},

  connect: function () {
    var self = this,
        ws = new WebSocket(this.uri);

    ws.onerror = function(error) {
      console.log('WebSocket Error: ' + error);
      self.eventBus.trigger("ws:error", error);
    };

    ws.onmessage = function(e) {
      self.eventBus.trigger("ws:message", e.data);
    };

    ws.onopen = function(e) {
      console.log('WebSocket connection open to ' + this.uri);
      self.eventBus.trigger("ws:open", e);
    };
  }
});
