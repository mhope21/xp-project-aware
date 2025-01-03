FactoryBot.define do
  factory :recurring_availability do
    end_date { Faker::Date.between(from: 1.month.from_now, to: 6.months.from_now) } # Random date within the next 1 to 6 months
  end
end
