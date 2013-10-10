require 'sinatra/base'
require 'em-websocket'
require 'amqp'
require 'json'

module Redch

  EventMachine.run do
    class App < Sinatra::Base
      get '/' do
        erb :index
      end
    end

    AMQP.connect(:host => '127.0.0.1') do |connection, open_ok|
      puts "Connected to AMQP broker. Running #{AMQP::VERSION} version of the gem..."

      AMQP::Channel.new(connection) do |channel, open_ok|

        EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |ws|
          ws.onopen do |handshake|
            p ['open', ws.object_id]

            channel.queue("redch.test", :auto_delete => true).subscribe do |payload|
              p "got from 'redch.test' queue: #{payload}"
              p "message sent: #{payload}"

              ws.send payload
            end
          end

          ws.onmessage do |msg|
            p ['open', msg]
          end

          ws.onclose do |event|
            p ['close', ws.object_id, event]
          end
        end

      end
    end

    App.run!({:port => 3000})
  end
end
