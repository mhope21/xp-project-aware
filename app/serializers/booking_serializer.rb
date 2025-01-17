class BookingSerializer
  include JSONAPI::Serializer
  attributes :id, :event_name, :event_speaker, :start_time, :end_time, :status, :event_id, :availability_id, :availability_window

  def event_name
    object.event.title if object.event.present?
  end

  def event_speaker
    object.event.speaker if object.event.present?
  end

  def availability_window
    object.availability_window
  end
end
