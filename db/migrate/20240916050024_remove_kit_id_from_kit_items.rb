class RemoveKitIdFromKitItems < ActiveRecord::Migration[7.2]
  def change
    remove_column :kit_items, :kit_id, :integer
  end
end
