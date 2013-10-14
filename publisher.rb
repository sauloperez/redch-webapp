require 'amqp'
require 'json'
require 'random-location'
require 'securerandom'

module Redch

  class Publisher
    def initialize(routing_key, timespan)
      @routing_key = routing_key
      @timespan = timespan # in seconds
    end

    def run
      AMQP.start(:host => 'localhost') do |connection, open_ok|
        AMQP::Channel.new(connection) do |channel, open_ok|
          @exchange = channel.direct("")

          @timer = EventMachine.add_periodic_timer(@timespan) {
            payload = data
            @exchange.publish payload.to_json, :routing_key => "redch.test"
            p "published: #{payload.to_json}"
          }
        end
      end
    end

    private
    def data
      coord = RandomLocation.near_by(41.65038, 1.13897, 70_000)
      {
        id: SecureRandom.uuid,
        lat: coord[0],
        lng: coord[1],
        value: rand
      }
    end
  end

end

Redch::Publisher.new("redch.test", 2).run

