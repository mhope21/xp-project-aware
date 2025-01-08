class RemoveStripeColumnsFromDonations < ActiveRecord::Migration[7.2]
  def change
    change_table :orders do |t|
      t.remove :stripe_checkout_session_id if column_exists?(:donations, :stripe_checkout_session_id)
      t.remove :stripe_payment_intent_id if column_exists?(:donations, :stripe_payment_intent_id)
    end
  end
end
