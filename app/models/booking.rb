class Booking < ApplicationRecord
  belongs_to :event
  belongs_to :availability
  has_one :order, as: :product, dependent: :destroy
  has_one :user, through: :order
  has_one :speaker, through: :event

  enum status: { pending: 0, confirmed: 1, denied: 2 }

  def availability_window
    "#{availability.start_time} - #{availability.end_time}" if availability.present?
  end


  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true
end
