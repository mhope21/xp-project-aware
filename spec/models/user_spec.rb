require 'rails_helper'

RSpec.describe User, type: :model do
  # Create a user with the default role
  let(:regular_user) { create(:user, :regular_user) }

  it "is valid with valid attributes" do
    expect(regular_user).to be_valid
  end

  it "is not valid without a name" do
    regular_user.first_name = nil
    expect(regular_user).to_not be_valid
  end

  it "is not valid without a valid role" do
    regular_user.role = "Not valid"
    expect(regular_user).to_not be_valid
  end

  it "is not valid without a valid email" do
    regular_user.email = "abc.com"
    expect(regular_user).to_not be_valid
  end

  it "is not valid without an email" do
    regular_user.email = nil
    expect(regular_user).to_not be_valid
  end

  it "allows a user to attach a profile image" do
    regular_user.profile_image.attach(io: File.open(Rails.root.join('app', 'assets', 'images', 'test_image.png')), filename: 'test_image.png', content_type: 'image/png')
    expect(regular_user.profile_image).to be_attached
  end
end
