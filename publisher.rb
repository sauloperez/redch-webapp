require 'amqp'
require 'pathname'
require 'pp'
require 'json'

module Redch

  class Publisher
    def initialize(routing_key, timespan, filename)
      @routing_key = routing_key
      @timespan = timespan # in seconds
      @filename = File.expand_path(filename, Pathname.new(__FILE__).realpath)
    end

    def run
      AMQP.start(:host => 'localhost') do |connection, open_ok|
        AMQP::Channel.new(connection) do |channel, open_ok|
          @exchange = channel.direct("")

          @timer = EventMachine.add_periodic_timer(@timespan) {
            paylaod = data(@filename)
            @exchange.publish paylaod, :routing_key => "redch.test"
            p "published: #{paylaod}"
          }
        end
      end
    end

    private
    def data(filename)
      array = JSON.parse File.read(filename)
      @data ||= array.values[0]

      @i ||= 0
      if @i == @data.length
        AMQP.stop{ EM.stop }
        exit(0)
      end

      value = @data[@i]
      @i += 1 unless @i == @data.length
      value
    end
  end

end

Redch::Publisher.new("redch.test", 2, "../public/data.json").run

