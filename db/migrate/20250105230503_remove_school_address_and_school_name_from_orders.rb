class RemoveSchoolAddressAndSchoolNameFromOrders < ActiveRecord::Migration[7.2]
  def change
    change_table :orders do |t|
      t.remove :school_name if column_exists?(:orders, :school_name)
      t.remove :school_address if column_exists?(:orders, :school_address)
    end
  end
end
