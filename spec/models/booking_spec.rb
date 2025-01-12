require 'rails_helper'

RSpec.describe Booking, type: :model do
  let(:speaker_user) { create(:user, :speaker_user) }
  let(:teacher) { create(:user, :teacher) }
  let(:availability) { create(:availability) }
  let(:event) { create(:event) }
  let(:booking) { create(:booking, event: event, availability: availability) }

  describe 'associations' do
    it { should belong_to(:event) }
    it { should have_one(:speaker).through(:event) }
    it { should have_one(:order) }
    it { should belong_to(:user) }
    it { should belong_to(:availability) }
  end

  describe 'validations' do
    it { should validate_presence_of(:start_time) }
    it { should validate_presence_of(:end_time) }
    it { should validate_presence_of(:status) }
  end

  describe 'status enum' do
    it 'should define the correct enum values' do
      expect(Booking.statuses).to eq({ 'pending' => 0, 'confirmed' => 1, 'denied' => 2 })
    end
  end

  describe 'booking within availability' do
    it "is valid when times are within availability" do
      booking = build(:booking, availability: availability, start_time: availability.start_time + 30.minutes, end_time: availability.end_time - 1.hour)
      expect(booking).to be_valid
    end

    it "is invalid when start_time is before availability" do
      booking = build(:booking, availability: availability, start_time: Time.now - 30.minutes, end_time: Time.now + 1.hour)
      expect(booking).not_to be_valid
      expect(booking.errors[:base]).to include("Booking times must be within the availability window")
    end

    it "is invalid when end_time is after availability" do
      booking = build(:booking, availability: availability, start_time: Time.now + 1.hour, end_time: Time.now + 3.hours)
      expect(booking).not_to be_valid
      expect(booking.errors[:base]).to include("Booking times must be within the availability window")
    end
  end
end
