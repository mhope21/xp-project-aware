FactoryBot.define do
  factory :user do
    name { Faker::Name.unique.name }
    email { Faker::Internet.unique.email }
    password { "greenapple99" }

    trait :admin do
      role { "admin" }
    end

    trait :regular_user do
      role { "user" }
    end
  end
end
