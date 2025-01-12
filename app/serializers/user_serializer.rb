class UserSerializer
  # Defines how to display the user model, uses JSONAPI because it is required by my Devise implementation.
  include JSONAPI::Serializer
  attributes :id, :email, :first_name, :last_name, :name, :role, :created_at

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
end
