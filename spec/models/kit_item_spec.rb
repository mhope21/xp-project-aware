require "rails_helper"

RSpec.describe KitItem, type: :model do
  let (:kit_item) { create (:kit_item) }

  it "is valid with valid attributes" do
    expect(kit_item).to be_valid
  end

  it "is not valid without a name" do
    kit_item.name = nil
    expect(kit_item).to_not be_valid
  end

  it "is not valid without a valid name" do
    kit_item.name = "It"
    expect(kit_item).to_not be_valid
  end

  it "is not valid without a valid description" do
    kit_item.description = "Not valid"
    expect(kit_item).to_not be_valid
  end

  it { should have_and_belong_to_many (:kits) }
end
