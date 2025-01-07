class UserProfileSerializer
  include JSONAPI::Serializer
  attributes :name, :email, :id, :bio, :profile_image_url

  attribute :donations do |user|
    user.donations ? user.donations.map { |donation| DonationSerializer.new(donation).serializable_hash } : []
  end

  attribute :orders do |user|
    user.orders ? user.orders.map { |order| OrderSerializer.new(order).serializable_hash } : []
  end

  # Added the profile_image_url method here
  attribute :profile_image_url do |user|
    if user.profile_image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(user.profile_image, only_path: true)
    else
      ActionController::Base.helpers.asset_path("default_profile_image.png")
    end
  end
end
