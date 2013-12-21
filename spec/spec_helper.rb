ENV["RACK_ENV"] = "test"

# Pull in non-grouped gems plus 'test' group
require 'bundler/setup'
Bundler.require :default, :test

require 'rack/test'
require_relative '../app'

module RSpecMixin
  include Rack::Test::Methods
  def app() described_class end
end

RSpec.configure { |c| c.include RSpecMixin }
