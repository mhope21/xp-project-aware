class EventSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :duration, :speaker_id


  belongs_to :speaker, serializer: UserSerializer
  has_many :bookings
end
