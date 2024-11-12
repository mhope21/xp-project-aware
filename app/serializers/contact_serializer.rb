class ContactSerializer < ActiveModel::Serializer
  # Defines how to display the contact model
  attributes :id, :name, :email, :phone, :message, :user_id

  def user_id
    object.user.id if object.user.present?
  end
end
