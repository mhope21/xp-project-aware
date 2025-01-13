class OrganizationSerializer
  include JSONAPI::Serializer
  attributes :name, :org_type, :address
end
