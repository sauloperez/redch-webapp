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
  },

  buildMessage: function() {
    return '{"action":"'+ _.sample(['add', 'delete']) +'","coord":[41.42142441631396,2.20510654694952],"value":0.57}';
  },

  isObservation: function(obs) {
    return (!!obs.get('action') && (obs.get('action') == 'add' || obs.get('action') == 'delete') &&
            !!obs.get('coord') && _.isNumber(obs.get('coord')[0]) && _.isNumber(obs.get('coord')[1]) &&
            !!obs.get('value') && _.isNumber(obs.get('value')));
  }

};
