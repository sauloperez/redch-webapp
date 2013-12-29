require_relative "./spec_helper"

describe "/stream" do
  let(:exchange_name) { "samples" }
  let(:em) { double EM }

  before :each do
    mock_EM(em)
    mock_amqp
    stream = mock_stream
  end

  it 'should open a streaming connection' do
    em.run do
      get '/stream', provides: 'text/event-stream'
      expect(last_response.content_type).to eq 'text/event-stream;charset=utf-8'
    end
  end

  it 'should create a channel' do
    em.run do
      expect(AMQP::Channel).to receive(:new)
      Redch.subscribe_to exchange_name, stream
    end
  end

  it 'should create a fanout exchange' do
    em.run do
      expect(channel).to receive(:fanout)
      Redch.subscribe_to exchange_name, stream
    end
  end

  it 'should subscribe to the queue' do
    em.run do
      expect(queue).to receive(:subscribe)
      Redch.subscribe_to exchange_name, stream
    end
  end
end
