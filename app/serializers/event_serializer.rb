# app/serializers/event_serializer.rb
class EventSerializer
  include JSONAPI::Serializer

  attributes :id, :title, :description, :start_time, :end_time, :location, :speaker
end
