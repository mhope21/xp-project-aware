class KitRequestSerializer < ActiveModel::Serializer
  # Defines how to display the KitRequest model
  attributes :id, :request_name, :request_email, :requested_kit, :kit_id, :user_id, :school_name, :school_address, :school_year, :comments, :phone, :created_at

  def request_name
    object.user.name if object.user.present?
  end

  def requested_kit
    object.kit.name if object.kit.present?
  end

  def request_email
    object.user.email if object.user.present?
  end
end
