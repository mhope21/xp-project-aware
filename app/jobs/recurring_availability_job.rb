class RecurringAvailabilityJob < ApplicationJob
  queue_as :default

  def perform(viewing_month, viewing_year)
    Rails.logger.info "Viewing month and year: #{viewing_month}, #{viewing_year}"
  # Get the start and end date of the next month
  start_of_next_month = Date.new(viewing_year, viewing_month).next_month.beginning_of_month
  end_of_next_month = start_of_next_month.end_of_month

  # Fetch all recurring availabilities with an end date later than the start of the next month
  recurring_availabilities = RecurringAvailability.where("end_date >= ?", start_of_next_month)

  recurring_availabilities.each do |recurring_availability|
    # Fetch availabilities linked to the recurring availability
    availabilities = Availability.where(recurring_availability_id: recurring_availability.id)

    availabilities.each do |availability|
      # Get the start time of the existing availability
      recurring_start_time = availability.start_time

      # Get the day of the week of the recurring availability (the weekday of the start time)
      recurring_weekday = recurring_start_time.wday

      # Start from the first day of the next month
      current_date = start_of_next_month

      # Check if the recurring availability extends past the start of the month
      while current_date <= end_of_next_month
        # Check if the current date's weekday matches the recurring availability's weekday
        if current_date.wday == recurring_weekday
          # Get the exact time of the current occurrence (same hour, minute, second as the original)
          new_start_time = current_date.change(hour: recurring_start_time.hour, min: recurring_start_time.min, sec: recurring_start_time.sec)
          new_end_time = new_start_time + (availability.end_time - availability.start_time)

          Rails.logger.info("Checking availability for speaker #{availability.speaker_id} on #{new_start_time}")

          # Check if an availability already exists for this exact time
          unless Availability.exists?(speaker_id: availability.speaker_id, start_time: new_start_time)
            # Create a new availability for this day with the same exact time
            Availability.create!(
              start_time: new_start_time,
              end_time: new_end_time,
              speaker_id: availability.speaker_id,
              recurring_availability_id: recurring_availability.id,
              booked: false
            )
            Rails.logger.info("Created availability for speaker #{availability.speaker_id} on #{new_start_time}")
          else
            Rails.logger.info("Availability already exists for speaker #{availability.speaker_id} on #{new_start_time}")
          end
        end

        # Move to the next week
        current_date += 1.week
      end
      end
    end
  end
end
