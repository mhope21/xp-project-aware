require 'rails_helper'

RSpec.describe Donation, type: :model do
  let(:regular_user) { create(:user, :regular_user) }
  let (:donation) { create(:donation, user: regular_user) }


  it "is valid with valid attributes" do
    expect(donation).to be_valid
  end

  it "is not valid without an amount" do
    donation = build(:donation, amount: nil)
    expect(donation).to_not be_valid
  end

  it "is not valid without a payment_status" do
    donation = build(:donation, payment_status: nil)
    expect(donation).to_not be_valid
  end

  it "is not valid without a valid amount" do
    donation = build(:donation, amount: 0)
    expect(donation).to_not be_valid
  end

  it { should belong_to (:user) }
end
