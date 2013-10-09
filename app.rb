require 'sinatra'
require 'em-websocket'
require 'pp'

$channel = EM::Channel.new

EM.run {

  class App < Sinatra::Base
    get '/' do
      erb :index
    end
  end

  EM::WebSocket.run(:host => "0.0.0.0", :port => 8080) do |ws|
    ws.onopen { |handshake|
      puts "WebSocket connection open"

      # Access properties on the EM::WebSocket::Handshake object, e.g.
      # path, query_string, origin, headers

      pp "handshake = #{handshake.inspect}"

      # Publish message to the client
      ws.send "Hello Client, you connected to #{handshake.path}"
    }

    ws.onclose { puts "Connection closed" }

    ws.onmessage { |msg|
      puts "Recieved message: #{msg}"
      ws.send "Pong: #{msg}"
    }
  end

  App.run!
}
