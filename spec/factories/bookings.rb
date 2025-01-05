FactoryBot.define do
  factory :booking do
    association :event
    start_time { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now) }
    end_time { Faker::Time.between(from: DateTime.now, to: DateTime.now + 1) }
    status { :confirmed }
  end
end
