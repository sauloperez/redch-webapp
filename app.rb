require 'sinatra/base'
require 'pp'

module Redch
  class App < Sinatra::Base
    get '/' do
      erb :index
    end
  end
end
