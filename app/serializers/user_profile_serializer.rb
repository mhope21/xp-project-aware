class UserProfileSerializer
  include JSONAPI::Serializer
  attributes :name, :email, :id, :role, :bio, :profile_image_url, :organization_id

  attribute :donations do |user|
    user.donations ? user.donations.map { |donation| DonationSerializer.new(donation).serializable_hash } : []
  end


  attribute :orders do |user|
    if user.orders
      kit_orders = user.orders.select { |order| order.product.is_a?(Kit) }
      kit_orders.map { |order| OrderSerializer.new(order).serializable_hash }
    else
      []
    end
  end

  attribute :bookings do |user|
    fetch_bookings(user)
  end

  attribute :organization do |user|
    if user.organization
      OrganizationSerializer.new(user.organization).serializable_hash[:data][:attributes]
    else
      {}
    end
  end

  attribute :addresses do |user|
    user.addresses.map { |address| AddressSerializer.new(address).serializable_hash[:data][:attributes] }
  end

  # Added the profile_image_url method here

  def profile_image_url
    if object.profile_image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(object.profile_image, only_path: false)
    end
  end

  private

  def fetch_bookings(user)
    if user.role == "teacher"
      user.orders.includes(:product).where(products: { type: "Booking" }).map do |order| BookingSerializer.new(order.product).serializable_hash
      end
    elsif user.role == "speaker"
      Booking.joins(:event).where(events: { speaker_id: user.id }).map do |booking| BookingSerializer.new(booking).serializable_hash
      end
    else
      []
    end
  end
end
