class RemoveKitIdFromOrders < ActiveRecord::Migration[7.2]
  def change
    remove_column :orders, :kit_id, :integer
  end
end
