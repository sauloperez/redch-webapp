require 'sinatra/base'
require 'amqp'
require 'json'

module Redch

  class App < Sinatra::Base

    configure do
      enable :logging
      EM.next_tick do
        # url = ENV['AMQP_URL'] || "amqp://guest:guest@localhost"
        AMQP.connection = AMQP.connect :host => '127.0.0.1'
      end
    end
    
    get '/' do
      erb :index
    end

    get '/stream', provides: 'text/event-stream' do
      stream :keep_open do |out|
        p "New connection:  #{out}"

        AMQP::Channel.new do |channel|
          channel.queue('', exclusive: true) do |queue|
            # create a queue and bind it to the fanout exchange
            queue.bind(channel.fanout("samples")).subscribe do |payload|
              p "#{payload} forwarded to clients"
              out << "data: #{payload}\n\n"
            end
          end

          # add a timer to keep the connection alive 
          timer = EM.add_periodic_timer(20) { out << ":\n" } 

          # clean up when the user closes the stream
          out.callback do
            timer.cancel
            channel.close

            p "Removed connection:  #{out}"
          end
        end
      end
    end

  end

  App.run!({:port => 3000})
end
