class AddGradeLevelToKits < ActiveRecord::Migration[7.2]
  def change
    add_column :kits, :grade_level, :string
  end
end
