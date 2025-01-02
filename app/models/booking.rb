class Booking < ApplicationRecord
  belongs_to :event

  has_one :speaker, through: :event
  has_one :order, as: :product
  has_one :user, through: :order
end
