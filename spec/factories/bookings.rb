FactoryBot.define do
  factory :booking do
    association :user, factory: [ :user, :teacher_user ] # This creates a user before creating the booking
    association :event
    association :availability
    start_time { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now) }
    end_time { Faker::Time.between(from: DateTime.now, to: DateTime.now + 1) }
    status { :confirmed }

    after(:create) do |booking|
      create(:order, product: booking, user: booking.user)
    end
  end
end
