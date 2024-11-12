class SetAllDonationsActive < ActiveRecord::Migration[7.2]
  def up
    Donation.update_all(canceled: false)
  end
end
