class CreateKitRequests < ActiveRecord::Migration[7.2]
  def change
    create_table :kit_requests do |t|
      t.string :grade_level
      t.string :school_year
      t.references :kit, null: false, foreign_key: true

      t.timestamps
    end
  end
end
