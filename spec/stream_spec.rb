require_relative "./spec_helper"

describe "/stream" do
  let(:exchange_name) { "samples" }

  before do
    mock_EM
    mock_amqp
    mock_stream
  end

  it 'should open a streaming connection' do
    @event_machine.run do
      get '/stream', provides: 'text/event-stream'
      expect(last_response.content_type).to eq 'text/event-stream;charset=utf-8'
    end
  end

  it 'should create a channel' do
    @event_machine.run do
      expect(AMQP::Channel).to receive(:new)
      Redch.subscribe_to exchange_name, @stream
    end
  end

  it 'should create a fanout exchange' do
    @event_machine.run do
      expect(channel).to receive(:fanout)
      Redch.subscribe_to exchange_name, @stream
    end
  end

  it 'should subscribe to the queue' do
    @event_machine.run do
      expect(queue).to receive(:subscribe)
      Redch.subscribe_to exchange_name, @stream
    end
  end
end
