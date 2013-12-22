require 'sinatra/base'
require 'amqp'
require 'json'

module Redch

  class Subscription
    attr_reader :stream, :timer

    INTERVAL = 20

    def initialize(stream)
      @stream = stream
    end

    def to(exchange_name)
      channel  = AMQP::Channel.new(AMQP.connection)
      queue    = channel.queue('', exclusive: true)
      exchange = channel.fanout(exchange_name)

      queue.bind(exchange).subscribe do |payload|
        p "#{payload} forwarded to clients"
        stream << "data: #{payload}\n\n"
      end

      # add a timer to keep the connection alive
      @timer = EM.add_periodic_timer(INTERVAL) { stream << ":\n" }

      # clean up when the user closes the stream
      stream.callback do
        timer.cancel
        channel.close

        p "Removed connection:  #{stream.object_id}"
      end
    end
  end

  def self.subscribe_to(exchange_name, stream)
    Subscription.new(stream).to exchange_name
  end

  class App < Sinatra::Base
    configure do
      enable :logging
      EM.next_tick do
        AMQP.connection = AMQP.connect :host => ENV['AMQP_HOST']
      end
    end

    get '/' do
      erb :index
    end

    get '/stream', provides: 'text/event-stream' do
      stream :keep_open do |out|
        p "New connection: #{out.object_id}"

        Redch.subscribe_to('samples', out)
      end
    end

  end
end
