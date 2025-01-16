class AddressSerializer
  include JSONAPI::Serializer
  # Defines how to display the address model
  attributes :id, :street_address, :city, :state, :postal_code
end
