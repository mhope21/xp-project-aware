require 'rails_helper'
require 'cancan/matchers'

RSpec.describe Ability, type: :model do
  let(:admin) { create(:user, :admin) }
  let(:teacher) { create(:user, :teacher) }
  let(:speaker) { create(:user, :speaker_user) }
  let(:address) { create(:address, addressable: teacher) }
  let(:kit) { create(:kit) }
  let(:event) { create(:event, speaker: speaker) }
  let(:order) { create(:order, user: teacher, product: event, product_type: 'Event', product_id: event.id, address: address) }
  let(:booking) { create(:booking, event: event, order: order, start_time: Time.now, end_time: Time.now + 1.hour, status: :pending) }

  subject(:ability) { Ability.new(user) }

  context 'when user is an admin' do
    let(:user) { admin }

    it 'can manage all' do
      expect(ability).to be_able_to(:manage, :all)
    end
  end

  context 'when user is a teacher' do
    let(:user) { teacher }

    it 'can read their own bookings' do
      expect(ability).to be_able_to(:read, booking, order: { user_id: user.id })
    end

    it 'can create bookings' do
      expect(ability).to be_able_to(:create, Booking)
    end

    it 'can update their own bookings' do
      expect(ability).to be_able_to(:update, booking, order: { user_id: user.id })
    end

    it 'can read their own orders' do
      expect(ability).to be_able_to(:read, order, user_id: user.id)
    end

    it 'can create orders' do
      expect(ability).to be_able_to(:create, Order)
    end

    it 'can update their own orders' do
      expect(ability).to be_able_to(:update, order, user_id: user.id)
    end
  end

  context 'when user is a speaker' do
    let(:user) { speaker }

    it 'can read bookings for their events' do
      expect(ability).to be_able_to(:read, booking, event: { speaker_id: user.id })
    end

    it 'can manage their own events' do
      expect(ability).to be_able_to(:manage, event, speaker_id: user.id)
    end

    it 'can update bookings for their events' do
      expect(ability).to be_able_to(:update, booking, event: { speaker_id: user.id })
    end

    it 'can manage their own availability' do
      expect(ability).to be_able_to(:manage, Availability, speaker_id: user.id)
    end
  end

  context 'when user is a guest' do
    let(:user) { User.new }

    it 'can update their own profile' do
      expect(ability).to be_able_to(:update, User, id: user.id)
    end

    it 'can read kits' do
      expect(ability).to be_able_to(:read, Kit)
    end

    it 'can create donations' do
      expect(ability).to be_able_to(:create, Donation)
    end

    it 'can read their own donations' do
      expect(ability).to be_able_to(:read, Donation, user_id: user.id)
    end

    it 'cannot update donations' do
      expect(ability).not_to be_able_to(:update, Donation)
    end
  end
end
