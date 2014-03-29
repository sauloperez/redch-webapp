require 'rubygems'
require 'sinatra'

set :environment, ENV['RACK_ENV'].to_sym

if ENV['RACK_ENV'].to_s == 'production'
  disable :run, :reload
end

require './app'

run Redch::App
