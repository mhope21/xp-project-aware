FactoryBot.define do
  factory :booking do
    association :event, factory: [ :event ]
    association :user, factory: [ :user, :teacher_user ]
    start_time { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now) }
    end_time { Faker::Time.between(from: DateTime.now, to: DateTime.now + 1) }
    status { :confirmed }
  end
end
