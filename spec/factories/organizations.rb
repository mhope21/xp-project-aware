FactoryBot.define do
  factory :organization do
    name { Faker::Company.name }
    org_type { "school" }

    transient do
      address_count { 1 }
    end

    after(:create) do |organization, evaluator|
      create_list(:address, evaluator.address_count, addressable: organization)
    end
  end
end
