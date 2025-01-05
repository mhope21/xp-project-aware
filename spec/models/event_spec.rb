require 'rails_helper'

RSpec.describe Event, type: :model do
  let(:speaker) { create(:user, :speaker) }  
  let(:event) { create(:event, speaker: speaker) } 
  
  it 'is valid with a speaker' do
    expect(event).to be_valid  
    expect(event.speaker).to eq(speaker)
  end

  it 'is invalid without a speaker' do
    event_without_speaker = build(:event, speaker: nil) 
    expect(event_without_speaker).not_to be_valid  
  end

end
