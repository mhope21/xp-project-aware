require 'rails_helper'

RSpec.describe Organization, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      organization = build(:organization)
      expect(organization).to be_valid
    end

    it "is not valid without a name" do
      organization = build(:organization, name: nil)
      expect(organization).not_to be_valid
    end

    it "is not valid without an org_type" do
      organization = build(:organization, org_type: nil)
      expect(organization).not_to be_valid
    end
  end
end
