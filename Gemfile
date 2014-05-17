source "https://rubygems.org"

gem "sinatra", "~> 1.4.4"
gem "amqp", "~> 1.1.7"
gem "json", "~> 1.8.1"

group :development do
  gem "thin", "~> 1.6.1"
  gem "sinatra-reloader", "~> 1.0"
  gem "capistrano", "~> 3.1.0"
  gem 'capistrano-bundler', '~> 1.1.2'
  gem "byebug"
end

group :test do
  gem "rspec", "~> 2.14.1"
  gem "rack-test", "~> 0.6.2", require: "rack/test"
end

group :development, :test do
  gem "foreman", "~> 0.63.0"
end

