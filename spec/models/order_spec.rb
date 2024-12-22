require "rails_helper"

RSpec.describe Order, type: :model do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:teacher) { create(:user, :teacher) }
  let(:address) { create(:address, addressable: user) }
  let(:kit) { create(:kit) }
  let(:order) { create(:order, user: teacher, kit: kit, address: address) }

  it "is valid with valid attributes" do
    expect(order).to be_valid
  end

  it "is not valid without a valid school_year" do
    order = build(:order, school_year: "Not valid", user: teacher, kit: kit)
    expect(order).to_not be_valid
  end

  it "is not valid without a school_year" do
    order = build(:order, school_year: nil, user: teacher, kit: kit)
    expect(order).to_not be_valid
  end

  it "is not valid without a valid phone number" do
    order = build(:order, phone: "333445", user: teacher, kit: kit)
    expect(order).to_not be_valid
  end

  it "is not valid without a phone number" do
    order = build(:order, phone: nil, user: teacher, kit: kit)
    expect(order).to_not be_valid
  end

  it { should belong_to(:user) }

  it { should belong_to(:kit) }
end
