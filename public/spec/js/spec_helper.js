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
    var msg = {
      'id': this.generateId(),
      'action': _.sample(['ADD', 'DELETE']),
      'sensorId': this.generateSensorId(),
      'coord': [41.42142441631396,2.20510654694952],
      'value': Math.random()
    };

    return JSON.stringify(msg);
  },

  generateId: function() {
    id = Math.random().toString(36).slice(2, 10) + '-'
       + Math.random().toString(36).slice(2, 6) + '-'
       + Math.random().toString(36).slice(2, 6) + '-'
       + Math.random().toString(36).slice(2, 6) + '-'
       + Math.random().toString(36).slice(2, 14);

    return id;
  },

  generateSensorId: function() {
    var mac = '54:52:00';
    for (var i = 0; i < 6; i++) {
      if (i%2 === 0) mac += ':';
      mac += Math.floor(Math.random()*16).toString(16);
    }
    return mac;
  },

  isObservation: function(obs) {
    return (!!obs.get('action') && (obs.get('action') == 'add' || obs.get('action') == 'delete') &&
            !!obs.get('coord') && _.isNumber(obs.get('coord')[0]) && _.isNumber(obs.get('coord')[1]) &&
            !!obs.get('value') && _.isNumber(obs.get('value')));
  }

};
