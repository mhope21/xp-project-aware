class UserProfileSerializer < ActiveModel::Serializer
  attributes :name, :email

  # handle nil values
  attribute :donations do |user|
    user.donations ? DonationSerializer.new(user.donations) : []
  end

  attribute :orders, if: :include_orders? do |user|
    user.orders ? OrderSerializer.new(user.orders) : []
  end

  # check if the user is a teacher
  def include_orders?(user, params)
    params[:current_user].teacher?
  end
end
