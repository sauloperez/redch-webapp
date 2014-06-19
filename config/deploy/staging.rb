set :user, 'vagrant'
set :group, 'vagrant'

set :ssh_options, {
  forward_agent: true
}

server '33.33.13.38', user: 'vagrant', roles: %w{app}

