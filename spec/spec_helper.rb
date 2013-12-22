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
