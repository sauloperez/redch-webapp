describe('Redch.Collections.Observations', function() {
  var observations, msg;

  beforeEach(function() {
    msg = JSON.parse(SpecHelper.buildMessage({ action: 'ADD' }));
    observations = new Redch.Collections.Observations();
  });

  it("doesn't sync with the server", function() {
    var ajaxSpy = sinon.spy(Backbone, 'ajax');

    observations.process(msg);
    msg.action = 'DELETE';
    observations.process(msg);

    expect(ajaxSpy).not.toHaveBeenCalled();
  });

  describe('createFromMessage', function() {
    it('creates and returns the observation created from the message', function() {
      var obs = observations.createFromMessage(msg);
      expect(SpecHelper.isObservation(obs)).toBe(true);
    });

    it('adds the observation to the collection', function() {
      var oldLength = observations.models.length;
      observations.createFromMessage(msg);
      expect(observations.models.length).toEqual(oldLength + 1);
    });

    it('updates the observation if it already exists one with the same sensor id', function() {
      var obs = observations.createFromMessage(msg),
          oldLength = observations.models.length,
          obsUpdate = observations.createFromMessage(msg),
          msg = JSON.parse(SpecHelper.buildMessage({
            'sensorId': obs.get('sensorId')
          }));


      expect(observations.models.length).toEqual(oldLength);
      expect(obsUpdate.get('sensorId')).toEqual(obs.get('sensorId'));
    });
  });

  describe('removeFromMessage', function() {
    var obsToDelete, obsToKeep;

    beforeEach(function() {
      for (var i = 0; i < 2; i++) {
        msg = JSON.parse(SpecHelper.buildMessage({ action: 'ADD' }));
        observations.add(msg);
      }
      obsToDelete = observations.at(0);
      obsToKeep = observations.at(1);
    });

    it('removes the observation with sensor id equal to the sensor id of the message', function() {
      var msg = JSON.parse(SpecHelper.buildMessage({
        'action': 'DELETE',
        'sensorId': obsToDelete.get('sensorId')
      }));

      observations.removeFromMessage(msg);

      expect(observations.findWhere({ 'sensorId': msg.sensorId })).toBeFalsy();
    });

    it('does not remove the observations with sensor id not equal to the sensor id of the message', function() {
      var msg = JSON.parse(SpecHelper.buildMessage({
        'sensorId': obsToDelete.get('sensorId')
      }));

      observations.removeFromMessage(msg);

      expect(observations.findWhere({ 'sensorId': obsToKeep.get('sensorId') })).toBeTruthy();
    });

    it('does not add the observation in the collection', function() {
      var oldLength = observations.length,
          msg = JSON.parse(SpecHelper.buildMessage({
            'sensorId': obsToDelete.get('sensorId')
          }));

      observations.removeFromMessage(msg);

      expect(observations.length).toEqual(oldLength - 1);
    });
  });


  describe('process', function() {
    it('adds the observation to the collection if action is ADD', function() {
      var createStub = sinon.stub(Redch.Collections.Observations.prototype, 'createFromMessage');

      observations.process(msg);
      expect(createStub).toHaveBeenCalledWith(msg);
    });

    it('deletes the observation from the collection if actions is DELETE', function() {
      var removeStub = sinon.stub(Redch.Collections.Observations.prototype, 'removeFromMessage');

      observations.process(msg);

      msg.action = 'DELETE';
      observations.process(msg);

      expect(removeStub).toHaveBeenCalledWith(msg);
    });

    it('throws an Error if action is not valid', function() {
      expect(function() {
        msg.action = '';
        observations.process(msg);
      }).toThrow();
    });
  });
});
