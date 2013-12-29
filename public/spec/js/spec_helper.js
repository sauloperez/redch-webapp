var SpecHelper = {

  mockEventBus: function() {
    return {
      events: {},
      trigger: function(event) {
        var handler = this.events[event]
        if (handler) handler.call(this);
      },
      on: function(event, func) {
        this.events[event] = func;
      }
    };
  }
  
};