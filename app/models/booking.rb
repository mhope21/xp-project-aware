class Booking < ApplicationRecord
  belongs_to :event
  belongs_to :availability
  has_one :order, as: :product
  belongs_to :user, -> { where(role: "teacher") }, class_name: "User"
  has_one :speaker, through: :event

  enum status: { pending: 0, confirmed: 1, denied: 2 }

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true
  validate :time_within_availability

  private

  def time_within_availability
    return if availability.nil? || start_time.nil? || end_time.nil?

    if start_time < availability.start_time || end_time > availability.end_time
      errors.add(:base, "Booking times must be within the availability window")
    end
  end
end
