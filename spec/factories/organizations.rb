FactoryBot.define do
  factory :organization do
    name { Faker::Educator.secondary_school }
    org_type { :school }
    association :address, factory: :address
  end
end
