class AddDefaultToDonationsCanceled < ActiveRecord::Migration[7.2]
  def change
    change_column_default :donations, :canceled, from: nil, to: false
  end
end
