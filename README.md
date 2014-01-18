# Redch Webapp

Redch Webapp is the client webapp of the [Redch](https://raw.github.com/sauloperez/redch) project. It visualizes observations coming from a [RabbitMQ](http://www.rabbitmq.com/) queue on top of a map in real time.

Each browser visiting the home page opens a streaming connection with the server. Once the webapp is subscribed to the queue, all observations gathered from it are pushed to each client browser using [Server Sent Events](http://en.wikipedia.org/wiki/Server-sent_events). 

## Installation

Redch Webapp has been built with [Sinatra](http://www.sinatrarb.com/), among other gems.

First, clone the repo:

    git clone git@github.com:sauloperez/redch-webapp.git

Next, install its dependencies:

    bundle install

[Foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html) is used to start the app and handle different environments. You can find further documentation in [Process Types and the Procfile](https://devcenter.heroku.com/articles/procfile#developing-locally-with-foreman) from Heroku Dev Center and from its [Github repo](https://github.com/ddollar/foreman).

Redch Webapp gets the observations from a RabbitMQ, so make sure the server is running and accessible from within your network. Besides, you must load the appropriate environment file containing the values for the required env variables. It must contain the following:

    AMQP_HOST=<RabbitMQ_server_host>

As you can see in [app.rb](https://github.com/sauloperez/redch-webapp/blob/develop/app.rb#L53), the RabbitMQ client subscribes to the AMQP_HOST endpoint to receive the messages.


## Usage

Now we are ready to start the webapp. From the root folder type the following in your terminal, replacing `development` with the proper environment file:

    foreman start -e development

Nevertheless, it is recommended to have an environment file per machine ignored by git, so any customizations can be made for that machine.

That's all. The webapp is up and running. Point your browser to ```http://localhost:3000``` and you will see the real time map.


## Testing

Testing covers both frontend and backend of the app. Jasmine has been chosen for the former while RSpec for the latter.

To test the frontend start up the server as stated above and point your browser to `http://localhost:3000/SpecRunner.html`. You will get immediate of how many test are passing (hopefully all of them).

As for the backend, type the following in your terminal:

	$ rspec spec

This will execute all tests contained in the spec folder. 

