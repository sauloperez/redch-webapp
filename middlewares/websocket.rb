require 'faye/websocket'
require 'json'
require 'pp'

module Redch

  class Websocket
    KEEPALIVE_TIME = 15 # in seconds

    def initialize(app)
      @file = File.expand_path("../../public/data.json", Pathname.new(__FILE__).realpath)
      @i = 0
      @app = app
      @clients = []
    end

    def call(env)
      if Faye::WebSocket.websocket?(env)
        ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })

        ws.on :open do |event|
          p [:open, ws.object_id]
          @clients << ws

          @clients.each do |ws|
            # ws.send "#{ws.object_id}, your ws has been registered"
            ws.send data(@file).values[0][@i]
            @i += 1 unless @i == data(@file).values[0].length

            p "sent #{data(@file).values[0][@i]}"
          end
        end

        ws.on :message do |event|
          p [:message, event.data]
          ws.send(event.data)
        end

        ws.on :close do |event|
          p [:close, ws.object_id, event.code, event.reason]
          @clients.delete(ws)
          ws = nil
        end

        # Return async Rack response
        ws.rack_response

      else
        @app.call(env)
      end
    end

    private
    def data(filename)
     @data ||= JSON.parse File.read(filename)
    end

    def sanitize(message)
      json = JSON.parse(message)
      json.each {|key, value| json[key] = ERB::Util.html_escape(value) }
      JSON.generate(json)
    end
  end
end
