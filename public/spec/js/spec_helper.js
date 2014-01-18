var SpecHelper = {

  mockEventBus: function() {
    return {
      events: {},
      trigger: function(eventName) {
        var args = Array.prototype.slice.call(arguments),
            handler = this.events[eventName];

        // Remove the event name
        args.shift();
        if (handler) handler.apply(this, arguments);
      },
      on: function(event, func) {
        this.events[event] = func;
      }
    };
  }

};
