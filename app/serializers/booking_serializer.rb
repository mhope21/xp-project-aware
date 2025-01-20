class BookingSerializer
  include JSONAPI::Serializer
  attributes :id, :event_name, :event_speaker, :start_time, :end_time, :status, :event_id, :availability_id, :availability_window, :booking_name, :booking_location

  belongs_to :event, serializer: EventSerializer

  attribute :event_name do |booking|
    booking.event.title if booking.event.present?
  end
  attribute :event_speaker do |booking|
    booking.event.speaker if booking.event.present?
  end
  attribute :availability_window do |booking|
    booking.availability_window
  end

  attribute :booking_name do |booking|
    # Ensure booking.order and user are present before accessing
    if booking.order && booking.order.user.present?
      booking.order.user.name
    else
      nil
    end
  end

  attribute :booking_location do |booking|
    # Ensure booking.order, user, and organization are present before accessing
    if booking.order && booking.order.user && booking.order.user.organization.present?
      booking.order.user.organization.addresses
    else
      nil
    end
  end

  def start_time
    object.start_time.iso8601
  end

  def end_time
    object.end_time.iso8601
  end
end
