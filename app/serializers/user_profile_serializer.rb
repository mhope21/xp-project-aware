class UserProfileSerializer
  include JSONAPI::Serializer
  attributes :name, :email, :id, :bio, :role, :profile_image_url, :organization_id

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
    if user.orders.present?
      if user.role == "teacher"
        booking_orders = user.orders.select { |order| order.product.is_a?(Booking) }
        booking_orders.map { |order| OrderSerializer.new(order).serializable_hash }
      end
    else
      []
    end
  end

  attribute :speaker_bookings do |user|
    if user.role == "speaker"
      events = Event.where(speaker_id: user.id)
      bookings = Booking.where(event_id: events.pluck(:id))
      bookings.map do |booking|
        BookingSerializer.new(booking).serializable_hash
      end
    end
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
end
