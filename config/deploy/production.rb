set :user, 'ubunt'
set :group, 'ubuntu'

set :ssh_options, {
  keys: %w(/Users/pau/.ssh/amazon.cer),
  forward_agent: true
}

server 'ec2-54-72-119-139.eu-west-1.compute.amazonaws.com', user: 'ubuntu', roles: %w{app}
