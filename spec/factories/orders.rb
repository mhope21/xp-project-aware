FactoryBot.define do
  factory :order do
    school_year { "2025-2026" }
    phone { "#{rand(100..999)}-#{rand(100..999)}-#{rand(1000..9999)}" }
    comments { "This is wonderful" }
    transient do
      product {nil}
    end
    after(:build) do |order, evaluator|
          order.product = evaluator.product
    end
    association :user, factory: :user
    association :address, factory: :address
  end
end
