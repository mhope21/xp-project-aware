require 'rails_helper'
require 'cancan/matchers'

RSpec.describe Ability, type: :model do
  let(:user) { create(:user) }
  let(:admin) { create(:user, role: 'admin') }
  let(:teacher) { create(:user, role: 'teacher') }
  let(:speaker) { create(:user, role: 'speaker') }
  let(:booking) { create(:booking) }
  let(:order) { create(:order, user: teacher) }
  let(:event) { create(:event, speaker: speaker) }

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
