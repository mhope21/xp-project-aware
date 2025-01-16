class RecurringAvailability < ApplicationRecord
    has_many :availabilities, dependent: :destroy
    has_one :speaker, -> { where(role: "speaker") }, through: :availabilities, source: :user

    validates :end_date, presence: true
    validate :end_date_cannot_be_in_the_past

    def recurs_on?(date)
      # Example logic: Recurs weekly on the same day of the week
      (start_date.wday == date.wday) && (end_date.nil? || date <= end_date)
    end

  private

  def end_date_cannot_be_in_the_past
    if end_date.present? && end_date < Time.zone.today
      errors.add(:end_date, "can't be in the past")
    end
  end
end
