FactoryBot.define do
  factory :booking do
    event
    start_time { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now) }
    end_time { Faker::Time.between(from: DateTime.now, to: DateTime.now + 1) }
    status { :confirmed }

    after(:create) do |booking|
      create(:order, product: booking, user: user)
    end
  end
end
