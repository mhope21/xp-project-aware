class Booking < ApplicationRecord
  belongs_to :event
  belongs_to :availability
  has_one :order, as: :product, dependent: :destroy
  has_one :user, through: :order
  has_one :speaker, through: :event

  enum status: { pending: 0, confirmed: 1, denied: 2 }

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true
end
