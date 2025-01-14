class AddSaveToUserToAddresses < ActiveRecord::Migration[7.2]
  def change
    add_column :addresses, :save_to_user, :boolean
  end
end
