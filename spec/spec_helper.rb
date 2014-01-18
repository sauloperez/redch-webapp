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

def mock_EventMachine
  em = double EM
  allow(em).to receive(:add_periodic_timer)
  allow(em).to receive(:run)
  em
end

def mock_amqp
  exchange = double AMQP::Exchange
  queue    = double AMQP::Queue
  channel  = double AMQP::Channel

  allow(channel).to receive(:queue) { queue }
  allow(channel).to receive(:fanout) { exchange }
  allow(channel).to receive(:close)

  allow(exchange).to receive(:name) { "" }

  allow(queue).to receive(:bind).with(exchange) { queue }
  allow(queue).to receive(:name) { "" }
  allow(queue).to receive(:subscribe)

  AMQP::Channel.stub(:new) { channel }
end

def mock_stream
  stream = double
  allow(stream).to receive(:callback)
  allow(stream).to receive(:<<)
  stream
end
