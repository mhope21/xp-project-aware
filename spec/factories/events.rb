FactoryBot.define do
  factory :event do
    title { "MyString" }
    description { "MyString" }
    duration { 1 }
    speaker { create(:user, :speaker) }
  end
end
