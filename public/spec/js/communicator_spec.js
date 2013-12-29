describe('Redch.Communicator', function() {
  var comm = Communicator,
      eventBusSpy = sinon.spy();

  beforeEach(function() {
    comm = new Communicator({
      eventBus: eventBusSpy,
      uri: '/stream'
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

  it("accepts a port", function() {
    c = new Communicator({
      eventBus: eventBusSpy,
      port: 3000
    });
    expect(c.config.port).toBe(3000);
  });

  it("accepts a hostname", function() {
    c = new Communicator({
      eventBus: eventBusSpy,
      hostname: "www.redch.org"
    });
    expect(c.config.hostname).toBe("www.redch.org");
  });

  describe("when no URI is specified", function(){
    it("builds it with the hostname and port provided", function() {
      c = new Communicator({
        eventBus: eventBusSpy,
        hostname: "www.redch.org",
        port: 3000
      });
      expect(c.uri).toBe("http://www.redch.org:3000");
    });
  });

  it("accepts an URI", function() {
    c = new Communicator({
      eventBus: eventBusSpy,
      uri: "http://www.redch.org:8888"
    });
    expect(c.uri).toBe("http://www.redch.org:8888");
  });

});