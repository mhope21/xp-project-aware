class CreateJoinTableKitsKitItems < ActiveRecord::Migration[7.2]
  def change
    create_join_table :kits, :kit_items do |t|
      # t.index [:kit_id, :kit_item_id]
      # t.index [:kit_item_id, :kit_id]
    end
  end
end
