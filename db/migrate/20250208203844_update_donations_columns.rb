class UpdateDonationsColumns < ActiveRecord::Migration[7.2]
  def change
    # Remove old columns
    remove_column :donations, :save_payment_info, :boolean
    remove_column :donations, :payment_token, :string

    # Add new columns
    add_column :donations, :stripe_checkout_session_id, :string
    add_column :donations, :stripe_payment_intent_id, :string
  end
end
