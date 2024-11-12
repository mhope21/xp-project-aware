FactoryBot.define do
  factory :kit_item do
    sequence(:name) { |n| "Picture book #{n}" } # Ensure unique names
    description { "Good book about something." }
  end
end
