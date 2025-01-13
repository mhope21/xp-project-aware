class RecurringAvailabilityJob < ApplicationJob
  queue_as :default

  def perform(viewing_month, viewing_year)
    start_date = DateTime.new(viewing_year, viewing_month, 1)
    end_date = start_date.end_of_month

    # Wrap the entire logic in a rescue block to handle unexpected errors
    begin
      # Check if availabilities for the specified month already exist
      existing_availabilities = Availability.where(start_time: start_date..end_date)
      return if existing_availabilities.exists?

      # Find all recurring availabilities that need to be created for the next month
      recurring_availabilities = RecurringAvailability.where("end_date IS NULL OR end_date >= ?", start_date)

      # Use a transaction to ensure atomicity
      Availability.transaction do
        recurring_availabilities.each do |recurring|
          (start_date.to_date..end_date.to_date).each do |date| # Use Date instead of DateTime
            if recurring.recurs_on?(date)
              Availability.create!(
                start_time: DateTime.new(date.year, date.month, date.day, recurring.start_time.hour, recurring.start_time.min, recurring.start_time.sec),
                end_time: DateTime.new(date.year, date.month, date.day, recurring.end_time.hour, recurring.end_time.min, recurring.end_time.sec),
                speaker_id: recurring.speaker_id,
                recurring_availability_id: recurring.id
              )
            end
          end
        end
      end

    rescue StandardError => e
      Rails.logger.error("RecurringAvailabilityJob failed for month #{viewing_month}, year #{viewing_year}: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      raise e # Re-raise the error to ensure the job retries or fails properly
    end
  end
end
