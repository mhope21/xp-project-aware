class DonationSerializer < ActiveModel::Serializer
  # Defines how to display the donations model
  attributes :id, :donor_name, :donor_email, :user_id, :amount, :payment_status, :stripe_checkout_session_id, :stripe_payment_intent_id, :created_at

  def donor_name
    object.user.name if object.user.present?
  end

  def donor_email
    object.user.email if object.user.present?
  end
end
