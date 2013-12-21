# Redch Webapp

Redch Webapp is Sinatra app used as frontend of the [Redch](https://raw.github.com/sauloperez/redch) project. It visualizes observations on top of a map in real time coming from a RabbitMQ and pushed to each client by Server Sent Events. Remember, for scalability matters, that those connections are kept open by the Sinatra app.

## Installation

Redch Webapp has been built with [Sinatra](http://www.sinatrarb.com/), among other gems.

First, clone the repo:

    git clone git@github.com:sauloperez/redch-webapp.git

Next, install its dependencies:

    bundle install

We use [Foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html) to start the app. You can find further documentation in [Process Types and the Procfile](https://devcenter.heroku.com/articles/procfile#developing-locally-with-foreman) from Heroku Dev Center and from its [Github repo](https://github.com/ddollar/foreman).

Redch Webapp gets the observations from a [RabbitMQ](http://www.rabbitmq.com/), so make sure the server is running and accessible from within your network. Besides, you must load the appropriate environment file containing the values for the required environmental variables. This is must be its content:

    AMQP_HOST=<RabbitMQ_server_host>

As you can see in ```app.rb```, the RabbitMQ client subscribes to this endpoint to get the messages.


## Usage

Now we are ready to start the webapp. From the root folder type the following in your terminal, replacing `.development` with the right environment file:

    foreman start -e .development

That's all. The webapp is up and running. Point your browser to ```localhost:3000``` and you will see the real time map.


