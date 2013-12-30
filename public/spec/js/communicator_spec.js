describe('Redch.Communicator', function() {
  var comm = Communicator,
      eventBusMock = SpecHelper.mockEventBus();

  beforeEach(function() {
    comm = new Communicator({
      eventBus: eventBusMock,
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
      eventBus: eventBusMock,
      port: 3000
    });
    expect(c.config.port).toBe(3000);
  });

  it("accepts a hostname", function() {
    c = new Communicator({
      eventBus: eventBusMock,
      hostname: "www.redch.org"
    });
    expect(c.config.hostname).toBe("www.redch.org");
  });

  describe("when no URI is specified", function(){
    it("builds it with the hostname and port provided", function() {
      c = new Communicator({
        eventBus: eventBusMock,
        hostname: "www.redch.org",
        port: 3000
      });
      expect(c.uri).toBe("http://www.redch.org:3000");
    });
  });

  it("accepts an URI", function() {
    c = new Communicator({
      eventBus: eventBusMock,
      uri: "http://www.redch.org:8888"
    });
    expect(c.uri).toBe("http://www.redch.org:8888");
  });

  describe("events", function() {
    var onOpenHandler = sinon.spy(),
        onMessageHandler = sinon.spy(),
        data = "simple message";

    beforeEach(function() {
      eventBusMock.on('communicator:open', onOpenHandler);
      eventBusMock.on('communicator:message', onMessageHandler);
      connectStub = sinon.stub(comm, 'connect', function() {
        comm.onOpen();
        comm.onMessage({ data: JSON.stringify(data) });
      });
      comm.connect();
    });

    it("triggers namespaced events", function() {
      expect(onOpenHandler).toHaveBeenCalled();
    });

    it("triggers an event once the connection is open", function() {
      expect(onOpenHandler).toHaveBeenCalled();
    });

    it("triggers an event when a message is received", function() {
      expect(onMessageHandler).toHaveBeenCalled();
    });

    it("passes the message as event handler argument", function() {
      var message;
      eventBusMock.on('communicator:message', function(msg) {
        message = msg;
      });
      comm.connect();
      expect(data).toBeTruthy();
    });
  });

});
