set :user, 'ubuntu'

set :ssh_options, {
  keys: %w(/Users/pau/.ssh/amazon.cer),
  forward_agent: true
}

server '54.72.161.42', user: 'ubuntu', roles: %w{app}
#server '54.72.167.118', user: 'ubuntu', roles: %w{amqp}
