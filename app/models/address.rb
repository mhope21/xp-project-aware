class Address < ApplicationRecord
  belongs_to :addressable, polymorphic: true
  has_many :orders

  attribute :save_to_user, :boolean, default: false

  validates :street_address, :city, :state, :postal_code, :addressable, presence: true
  validates :postal_code, format: { with: /\A\d{5}(-\d{4})?\z/, message: "must be a valid postal code" }
end
