require 'sinatra/base'
require 'amqp'
require 'json'

module Redch

  class StreamingSubscription
    attr_reader :stream, :timer, :channel, :exchange, :queue

    INTERVAL = 20 # in seconds

    def initialize(stream)
      @stream = stream
    end

    def to(exchange_name)
      @channel  = AMQP::Channel.new(AMQP.connection)
      @queue    = channel.queue('', exclusive: true)
      @exchange = channel.fanout(exchange_name)

      # Send message to clients through the streaming connection
      queue.bind(exchange).subscribe do |payload|
        stream << "data: #{payload}\n\n"
      end

      keep_stream_alive_each INTERVAL

      # on stream close
      stream.callback { clean_up }
    end

    def keep_stream_alive_each(interval)
      @timer = EM.add_periodic_timer(interval) { stream << ":\n" }
    end

    def clean_up
      timer.cancel
      channel.close
    end
  end

  def self.subscribe_to(exchange_name, *args)
    stream = args[0][:stream]
    StreamingSubscription.new(stream).to exchange_name
  end

  class App < Sinatra::Base
    configure do
      enable :logging

      EM.next_tick do
        AMQP.connection = AMQP.connect :host => ENV['AMQP_HOST']
      end
    end

    before do
      env['rack.logger'] = Logger.new("#{settings.root}/log/#{settings.environment}.log", 'weekly')
    end

    get '/' do
      erb :index
    end

    get '/stream', provides: 'text/event-stream' do
      stream :keep_open do |out|
        logger.info "New connection: #{out.object_id}"

        Redch.subscribe_to 'samples', stream: out
      end
    end

  end
end
