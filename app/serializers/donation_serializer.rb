class DonationSerializer < ActiveModel::Serializer
  # Defines how to display the donations model
  attributes :id, :donor_name, :donor_email, :user_id, :amount, :created_at

  def donor_name
    object.user.name if object.user.present?
  end

  def donor_email
    object.user.email if object.user.present?
  end
end
