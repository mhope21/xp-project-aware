class Order < ApplicationRecord
  belongs_to :user
  belongs_to :product, polymorphic: true
  belongs_to :address

  attr_accessor :event_id, :start_time, :end_time, :status

  accepts_nested_attributes_for :address, allow_destroy: true

  before_validation :normalize_phone_number

  # Validates that phone number is in the right 10 digit format
  validates :phone, presence: true, format: { with: /\A\d{10}\z/, message: "must be a valid 10-digit phone number" }

  # validates school year with more flexibility
  validates :school_year, presence: true, format: {
    with: /\A\d{4}(-\d{2,4})?\z/,
    message: "must be in the fomat 'YYYY' or  'YYYY-YY' or 'YYYY-YYYY' "
  }

  validates :comments, allow_blank: true, length: { maximum: 500, message: "cannot exceed 500 characters" }

  # Ensure each user can only request one kit per school year
  # validate :valid_school_year
  # validate :within_school_year_limits, on: :create

  # Validates that the product is present
  validates :product_id, presence: true
  validates :product_type, presence: true


  def normalize_phone_number
    return if phone.blank?

    # Remove any non-numeric characters
    cleaned_phone = phone.delete("^0-9")

    # If the cleaned phone number is 10 digits, leave it as is
    if cleaned_phone.length == 10
      self.phone = cleaned_phone
    else
      # If it's longer than 10 digits (starts with "1"), remove the "1" prefix
      self.phone = cleaned_phone.delete_prefix("1")
    end
  end

  # Define the current school year
  # def self.current_school_year
  #   now = Time.now
  #   if now.month >= 6 # June or later
  #     "#{now.year}-#{now.year + 1}"
  #   else
  #     "#{now.year - 1}-#{now.year}"
  #   end
  # end

  private

  # Validation to ensure the school year is valid
  # def valid_school_year
  #   current_year = Order.current_school_year
  #   match = /\A\d{4}-\d{4}\z/.match(school_year)
  #   unless match && school_year.to_i == current_year.to_i
  #     errors.add(:school_year, "must match the current school year: #{current_year}")
  #   end
  # end

  # # Validation to enforce max limits per school year
  # def within_school_year_limits
  #   # Check if the product is a Kit
  #   if product_type == "Kit"
  #     kits_count = Order.where(user_id: user_id, school_year: school_year, product_type: "Kit").count
  #     if kits_count >= 1
  #       errors.add(:base, "You can only order one Kit per school year.")
  #     end
  #   end

  #   # Check if the product is a Booking
  #   if product_type == "Booking"
  #     bookings_count = Order.where(user_id: user_id, school_year: school_year, product_type: "Booking").count
  #     if bookings_count >= 2
  #       errors.add(:base, "You can only book up to two bookings per school year.")
  #     end
  #   end
  # end
end
