describe('Redch.Communicator', function() {
  var eventBusMock = SpecHelper.mockEventBus(),
      onOpenHandler = sinon.spy(),
      onMessageHandler = sinon.spy(),
      data = "simple message";

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
    var c = new Communicator({
      eventBus: eventBusMock,
      port: 3000
    });
    expect(c.config.port).toBe(3000);
  });

  it("accepts a hostname", function() {
    var c = new Communicator({
      eventBus: eventBusMock,
      hostname: "www.redch.org"
    });
    expect(c.config.hostname).toBe("www.redch.org");
  });

  describe("when no URI is specified", function(){
    it("builds it with the hostname and port provided", function() {
      var c = new Communicator({
        eventBus: eventBusMock,
        hostname: "www.redch.org",
        port: 3000
      });
      expect(c.uri).toBe("http://www.redch.org:3000");
    });
  });

  it("accepts an URI", function() {
    var c = new Communicator({
      eventBus: eventBusMock,
      uri: "http://www.redch.org:8888"
    });
    expect(c.uri).toBe("http://www.redch.org:8888");
  });

  describe("when already connected", function() {
    var c;

    beforeEach(function() {
      c = new Communicator({
        eventBus: eventBusMock,
        uri: '/stream'
      });
      c.connect();
    });

    it("does not trigger a new open event", function() {
      var reopenHandler = sinon.spy();
      eventBusMock.on('communicator:open', reopenHandler);
      c.connect();
      expect(reopenHandler).not.toHaveBeenCalled();
    });

    it("does not create a new connection object", function() {
      var oldConnection = c._connection;
      c.connect();
      expect(c._connection).toBe(oldConnection);
    });

    it("can be closed", function() {
      c.close();
      expect(c._connection).toBeFalsy();
    });
  });

  describe("events", function() {
    var onOpenHandler = sinon.spy(),
        onMessageHandler = sinon.spy(),
        invalidOriginComm;

    beforeEach(function() {
      eventBusMock.on('communicator:open', onOpenHandler);
      eventBusMock.on('communicator:message', onMessageHandler);
      sinon.stub(comm, 'connect', function() {
        comm.onOpen({ origin: comm.uri });
        comm.onMessage({
          origin: comm.uri,
          data: JSON.stringify(data)
        });
      });
      comm.connect();

      invalidOriginComm = new Communicator({
        eventBus: eventBusMock,
        uri: '/stream'
      });
      sinon.stub(invalidOriginComm, 'connect', function() {
        invalidOriginComm.onOpen({ origin: invalidOriginComm.uri });
        invalidOriginComm.onMessage({
          origin: "www.invalidorigin.com",
          data: JSON.stringify(data)
        });
      });
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
      expect(message).toBeTruthy();
    });

    it("triggers an Error event on error", function() {
      var errorHandler = function() { expect(true).toBe(true) },
          c = new Communicator({
            eventBus: eventBusMock,
            uri: 'invalidUri'
          });
      eventBusMock.on('communicator:error', errorHandler);
      c.connect();
    });

    it("throws an Error if message comes from invalid origin", function() {
      expect(function() {
        invalidOriginComm.connect();
      }).toThrow();
    });
  });

});
