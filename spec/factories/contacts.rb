FactoryBot.define do
  factory :contact do
    name { Faker::Name.unique.name }
    email { Faker::Internet.unique.email }
    phone { "#{rand(100..999)}-#{rand(100..999)}-#{rand(1000..9999)}" }
    message { "I would like to suggest some items." }
  end
end
