require 'rails_helper'

RSpec.describe Contact, type: :model do
  let (:contact) { create(:contact) }

  it "is valid with valid attributes" do
    expect(contact).to be_valid
  end

  it "is not valid without a name" do
    contact.name = nil
    expect(contact).to_not be_valid
  end

  it "is not valid without a valid email" do
    contact.email = "abc.com"
    expect(contact).to_not be_valid
  end

  it "is not valid without a valid phone number" do
    contact.phone = "467-2340"
    expect(contact).to_not be_valid
  end

  it "is not valid without an message" do
    contact.message = nil
    expect(contact).to_not be_valid
  end
end
