# app/serializers/event_serializer.rb
class EventSerializer
  include JSONAPI::Serializer

  attributes :id, :title, :description, :duration, :speaker_id
end
