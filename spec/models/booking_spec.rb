require 'rails_helper'

RSpec.describe Booking, type: :model do
  let(:event) { create(:event) }
  let(:order) { create(:order) }
  let(:booking) { create(:booking, event: event, order: order) }

  describe 'associations' do
    it { should belong_to(:event) }
    it { should have_one(:speaker).through(:event) }
    # product not yet finished
    # it { should have_one(:order) }
    it { should have_one(:user).through(:order) }
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
end
