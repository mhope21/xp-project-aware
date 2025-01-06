class UserProfileSerializer
  include JSONAPI::Serializer
  attributes :name, :email, :id, :bio, :profile_image_url

  attribute :donations do |user|
    user.donations ? user.donations.map { |donation| DonationSerializer.new(donation).serializable_hash } : []
  end

  attribute :orders do |user|
    user.orders ? user.orders.map { |order| OrderSerializer.new(order).serializable_hash } : []
  end

  # Add the profile_image_url method here 
  def profile_image_url
    if object.profile_image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(object.profile_image, only_path: true)
    else
      ActionController::Base.helpers.asset_path("default_profile_image.png")
    end
  end
end
