require_relative "./spec_helper"

describe "/stream" do
  let(:exchange_name) { "samples" }
  let(:em) { mock_EventMachine }
  let(:stream) { mock_stream }

  before { mock_amqp }

  it 'should open a streaming connection' do
    em.run do
      get '/stream', provides: 'text/event-stream'
      expect(last_response.content_type).to eq 'text/event-stream;charset=utf-8'
    end
  end

  it 'should create a channel' do
    em.run do
      expect(AMQP::Channel).to receive(:new)
      Redch.subscribe_to exchange_name, @stream
    end
  end

  it 'should create a fanout exchange' do
    em.run do
      expect(channel).to receive(:fanout)
      Redch.subscribe_to exchange_name, @stream
    end
  end

  it 'should subscribe to the queue' do
    em.run do
      expect(queue).to receive(:subscribe)
      Redch.subscribe_to exchange_name, @stream
    end
  end

  context 'when subscribed' do
    let(:subscription) { Redch::StreamingSubscription.new(stream) }

    it 'forwards each message to the clients' do
      em.run do
        subscription.to 'samples'
        subscription.exchange.publish "Hello, world!", routing_key: ''
        expect(stream).to receive(:<<).with("data: Hello, world!\n\n")
      end
    end
  end
end
