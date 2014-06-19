# Redch Webapp

Redch Webapp is the client webapp of the [Redch](http://54.72.161.42/) project. It visualizes observations coming from a [RabbitMQ](http://www.rabbitmq.com/) queue on top of a map in real time.

Each browser visiting the home page opens a streaming connection with the server. Once the webapp is subscribed to the queue, all observations gathered from it are pushed to each client browser using [Server Sent Events](http://en.wikipedia.org/wiki/Server-sent_events). 

## Installation

First, clone the repo:

    git clone git@github.com:sauloperez/redch-webapp.git

Next, install its dependencies:

    bundle install

Redch Webapp gets observations from a RabbitMQ, so make sure the RabbitMQ server is running and accessible from within your network. For Mac OS X users this is done be typing:

	rabbitmq-server

While for Ubuntu users this is done with:

	sudo /etc/init.d/rabbitmq-server start

Besides, you must load the appropriate Procfile containing the values for the required env variables. It must contain the following:

    AMQP_HOST=<RabbitMQ_server_host>

Name this file after the environment, e.g. ```development``` and save it wherever you like from your directory tree. You can edit the development file in [https://github.com/sauloperez/redch-webapp/blob/master/development](https://github.com/sauloperez/redch-webapp/blob/master/development).

You can find further documentation in [Process Types and the Procfile](https://devcenter.heroku.com/articles/procfile#developing-locally-with-foreman) from Heroku Dev Center and from its [Github repo](https://github.com/ddollar/foreman).


## Usage

### Development

Now we are ready to start the webapp. From the root folder type the following in your terminal, using the path of your environment file:

    foreman start -e <path_to_env_file>

Nevertheless, it is recommended to have a development environment file per machine ignored by git, so any customizations can be made for that machine.

That's all. The webapp is up and running. Point your browser to ```http://localhost:3000``` and you will see the real time map.

### Production

In production the deployment process is automatized using [Capistrano](http://capistranorb.com/). To deploy just type the following command from your machine:

	cap production deploy

This essentially runs commands on the remote server through SSH. Once the process is finished, point your browser to the production server.

Additionaly, some tasks to manage production services are provided. Each service has its own start, stop and restart actions:

	cap production nginx:restart
	cap production passenger:stop
	cap production rabbitmq:start
	
	# Or open an SSH connection
	cap production utils:ssh

To list all available tasks type:

	cap production -T


## Testing

Testing covers both frontend and backend of the app. Jasmine has been chosen for the former while RSpec for the latter.

To test the frontend start up the server as stated above and point your browser to `http://localhost:3000/SpecRunner.html`. You will get immediate results of how many test are passing (hopefully all of them).

As for the backend, type the following in your terminal:

	rspec spec

This will execute all tests contained in the ```/spec``` folder.
