FactoryBot.define do
  factory :kit do
    sequence(:name) { |n| "Discovery Kit #{n}" } # Ensure unique names
    description { "Everything you need." }
    grade_level { "PK-2" }
  end
end
