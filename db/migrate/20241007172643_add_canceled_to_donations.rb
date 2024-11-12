class AddCanceledToDonations < ActiveRecord::Migration[7.2]
  def change
    add_column :donations, :canceled, :boolean
  end
end
