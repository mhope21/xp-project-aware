FactoryBot.define do
  factory :donation do
    amount { "9.99" }
    payment_status { "string" }
    save_payment_info { false }
    payment_token { Faker::Lorem.characters(number: 16) }
    association :user
  end
end
