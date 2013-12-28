describe('Redch.Communicator', function() {
  var comm = Communicator,
      eventBusSpy = sinon.spy();

  beforeEach(function() {
    comm = new Communicator({
      eventBus: eventBusSpy
    });
  });

  it("throws an Error if no event bus is specified", function() {
    expect(function() {
      new Communicator();
    }).toThrow(new Error("eventBus not specified"));
  });

  describe("default values", function() {
    it("defaults to port 8080", function() {
      expect(comm.config.port).toBe(8080);
    });

    it("defaults to localhost", function() {
      expect(comm.config.hostname).toBe("localhost");
    });
  });

  it("sets the port", function() {
    c = new Communicator({
      eventBus: eventBusSpy,
      port: 3000
    });
    expect(c.config.port).toBe(3000);
  });

  it("sets the hostname", function() {
    c = new Communicator({
      eventBus: eventBusSpy,
      hostname: "www.redch.org"
    });
    expect(c.config.hostname).toBe("www.redch.org");
  });

});