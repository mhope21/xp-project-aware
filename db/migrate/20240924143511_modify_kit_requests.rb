class ModifyKitRequests < ActiveRecord::Migration[7.2]
  def change
    # Add new columns
    add_column :kit_requests, :phone, :string
    add_column :kit_requests, :school_name, :string
    add_column :kit_requests, :school_address, :string
    add_column :kit_requests, :comments, :text

    # Remove the grade_level column
    remove_column :kit_requests, :grade_level, :string

    # Add a reference to the users table
    add_reference :kit_requests, :user, foreign_key: true
  end
end
