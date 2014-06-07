# config valid only for Capistrano 3.1
lock '3.1.0'

set :application, 'redch'
set :repo_url, 'git://github.com/sauloperez/redch-webapp.git'

set :ssh_options, {
  forward_agent: true
}

ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

set :deploy_to, '/var/www/redch'

set :use_sudo, false

set :deploy_via, :copy
set :copy_strategy, :export

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Required when not using rvm or rbenv
SSHKit.config.command_map[:rake]  = "bundle exec rake"

after 'deploy:publishing', 'nginx:restart'
after 'deploy:publishing', 'passenger:restart'
