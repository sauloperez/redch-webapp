ENV['RACK_ENV'] = 'test'
ENV['AMQP_HOST'] = '127.0.0.1'

# Pull in non-grouped gems plus 'test' group
require 'bundler/setup'
Bundler.require :default, :test

require_relative '../app'

module RSpecMixin
  include Rack::Test::Methods
  def app() Redch::App end
end

RSpec.configure { |c|
  c.include RSpecMixin
}
