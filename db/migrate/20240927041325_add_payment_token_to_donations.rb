class AddPaymentTokenToDonations < ActiveRecord::Migration[7.2]
  def change
    add_column :donations, :payment_token, :string
  end
end
