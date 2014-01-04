ENV['RACK_ENV'] = 'test'

# Pull in non-grouped gems plus 'test' group
require 'bundler/setup'
Bundler.require :default, :test

require_relative '../app'

module RSpecMixin
  include Rack::Test::Methods
  def app() Redch::App end
end

RSpec.configure do |c|
  c.include RSpecMixin
end

def mock_EM
  @event_machine = double EM
  @event_machine.stub(:add_periodic_timer)
  @event_machine.stub(:run)
end

def mock_amqp
  exchange = double AMQP::Exchange
  queue = double AMQP::Queue
  channel = double AMQP::Channel

  channel.stub(:queue) { queue }
  channel.stub(:fanout) { exchange }
  channel.stub(:close)

  exchange.stub(:name) { "" }

  queue.stub(:bind).with(exchange) { queue }
  queue.stub(:name) { "" }
  queue.stub(:subscribe)

  AMQP::Channel.stub(:new) { channel }
end

def mock_stream
  @stream = double
  @stream.stub(:callback)
  @stream.stub(:<<)
end
