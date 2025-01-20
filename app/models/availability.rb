class Availability < ApplicationRecord
  # Associations
  belongs_to :speaker, -> { where(role: "speaker") }, class_name: "User"
  belongs_to :recurring_availability, optional: true
  attr_accessor :is_recurring, :recurring_end_date

  # Scope to filter by booked status
  scope :booked, -> { where(booked: true) }
  scope :available, -> { where(booked: false) }
  scope :future, -> { where("start_time >= ?", Time.now) }

  # Validations
  validates :start_time, :end_time, :speaker, presence: true

  # Validation for time range
  validate :start_time_before_end_time

  private

  def start_time_before_end_time
    if start_time.present? && end_time.present? && start_time >= end_time
      errors.add(:start_time, "must be before the end time")
    end
  end
end
