FactoryBot.define do
  factory :order do
    school_year { "2025-2026" }
    phone { "#{rand(100..999)}-#{rand(100..999)}-#{rand(1000..9999)}" }
    comments { "This is wonderful" }

    # Define a transient attribute `product` (a `Kit` or `Donation` or 'Event') with a default value of nil.
    transient do
      product { nil }
    end
    # Assign the transient `product` (a `Kit` or `Donation` or 'Event') to the order.
    after(:build) do |order, evaluator|
          order.product = evaluator.product
    end
    association :user, factory: :user
    association :address, factory: :address
  end
end
