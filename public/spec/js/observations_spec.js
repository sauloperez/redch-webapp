describe('Redch.Collections.Observations', function() {
  var observations, msg;

  beforeEach(function() {
    msg = JSON.parse(SpecHelper.buildMessage());
    observations = new Redch.Collections.Observations();
  });

  it('creates an observation from a message', function() {
    obs = observations.createFromMessage(msg);
    expect(SpecHelper.isObservation(obs)).toBe(true);
  });

  it('removes an observation from the collection given a message', function() {
    observations.createFromMessage(msg);
    observations.removeFromMessage(msg);
    expect(observations.models.length).toEqual(0);
  });

  it("doesn't sync with the server", function() {
    var ajaxSpy = sinon.spy(Backbone, 'ajax');

    msg.action = 'ADD';
    observations.process(msg);
    msg.action = 'DELETE';
    observations.process(msg);

    expect(ajaxSpy).not.toHaveBeenCalled();
  });

  describe('removeFromMessage', function() {
    var obsToDelete, obsToKeep;

    beforeEach(function() {
      for (var i = 0; i < 2; i++) {
        msg = JSON.parse(SpecHelper.buildMessage());
        msg.action = 'ADD';
        observations.add(msg);
      }
      obsToDelete = observations.at(0);
      obsToKeep = observations.at(1);
    });

    it('removes the observation with sensor id equal to the sensor id of the message', function() {
      var msg = JSON.parse(SpecHelper.buildMessage());
      msg.sensorId = obsToDelete.get('sensorId');
      msg.action = 'DELETE';

      observations.removeFromMessage(msg);
      expect(observations.find(function(model) {
        return model.get('sensorId') == msg.sensorId;
      })).toBeFalsy();
    });

    it('does not remove the observations with sensor id not equal to the sensor id of the message', function() {
      var msg = JSON.parse(SpecHelper.buildMessage());
      msg.sensorId = obsToDelete.get('sensorId');

      observations.removeFromMessage(msg);
      expect(observations.find(function(model) {
        return model.get('sensorId') == obsToKeep.get('sensorId');
      })).toBeTruthy();
    });
  });


  describe('process', function() {
    it('adds the observation to the collection if action is add', function() {
      msg.action = 'ADD';
      observations.process(msg);

      expect(observations.findWhere(msg)).toBeTruthy();
    });

    it('deletes the observation from the collection if actions is DELETE', function() {
      msg.action = 'ADD';
      observations.process(msg);

      msg.action = 'DELETE';
      observations.process(msg);

      expect(observations.models.length).toEqual(0);
    });

    it("throws an Error if action is not valid", function() {
      expect(function() {
        msg.action = '';
        observations.process(msg);
      }).toThrow();
    });
  });
});
