require "rails_helper"

RSpec.describe Kit, type: :model do
  let (:kit) { create (:kit) }

  it "is valid with valid attributes" do
    expect(kit).to be_valid
  end

  it "is not valid without a name" do
    kit.name = nil
    expect(kit).to_not be_valid
  end

  it "is not valid without a description" do
    kit.description = nil
    expect(kit).to_not be_valid
  end

  it "is not valid without a valid description" do
    kit.description = "Not valid"
    expect(kit).to_not be_valid
  end

  it "is not valid without a valid grade_level" do
    kit.grade_level = "PK"
    expect(kit).to_not be_valid
  end

  it "is not valid without a grade_level" do
    kit.grade_level = nil
    expect(kit).to_not be_valid
  end

  it { should have_and_belong_to_many (:kit_items) }
end
