class KitSerializer < ActiveModel::Serializer
  # Defines how to display the kit model
  attributes :id, :name, :description, :grade_level, :image_url

  has_many :kit_items

  # Method to include the image URL
  def image_url
    if object.image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(object.image, only_path: false)
    end
  end
end
