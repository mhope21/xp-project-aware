class CreateDonations < ActiveRecord::Migration[7.2]
  def change
    create_table :donations do |t|
      t.decimal :amount
      t.references :user, null: false, foreign_key: true
      t.string :payment_status
      t.boolean :save_payment_info

      t.timestamps
    end
  end
end
