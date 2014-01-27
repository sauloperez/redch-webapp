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

    msg.action = 'add';
    observations.process(msg);
    msg.action = 'delete';
    observations.process(msg);

    expect(ajaxSpy).not.toHaveBeenCalled();
  });

  describe('process', function() {
    it('adds the observation to the collection if action is add', function() {
      msg.action = 'add';
      observations.process(msg);
      expect(observations.findWhere(msg)).toBeTruthy();
    });

    it('deletes the observation from the collection if actions is delete', function() {
      msg.action = 'add';
      observations.process(msg);

      msg.action = 'delete';
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
