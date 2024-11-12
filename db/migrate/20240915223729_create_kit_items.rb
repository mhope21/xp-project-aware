class CreateKitItems < ActiveRecord::Migration[7.2]
  def change
    create_table :kit_items do |t|
      t.string :name
      t.text :description
      t.references :kit, null: false, foreign_key: true

      t.timestamps
    end
  end
end
