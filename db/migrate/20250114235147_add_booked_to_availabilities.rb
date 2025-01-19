class AddBookedToAvailabilities < ActiveRecord::Migration[7.2]
  def change
    add_column :availabilities, :booked, :boolean, default: false
  end
end
