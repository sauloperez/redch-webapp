require_relative "./spec_helper"

describe Redch::App do
  subject { last_response }

  context "/" do
    before :each do
      get '/'
    end

    it { should be_ok }

    it "shows a map" do
      expect(subject.body).to match /id="map"/
    end
  end
end
