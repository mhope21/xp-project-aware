class UserProfileSerializer < ActiveModel::Serializer
  attributes :name, :email

  attribute :donations do |user|
    DonationSerializer.new(user.donations)
  end

  attribute :orders, if: Proc.new { |user, params| params[:current_user].teacher? } do | user |
    OrderSerializer.new(user.orders)
  end
end
