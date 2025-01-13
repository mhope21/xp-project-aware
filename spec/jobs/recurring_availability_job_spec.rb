require 'rails_helper'

RSpec.describe RecurringAvailabilityJob, type: :job do
  # describe '#perform' do
  #   let(:viewing_month) { 1 } # January
  #   let(:viewing_year) { 2025 }
  #   let(:start_date) { Date.new(viewing_year, viewing_month, 1) }
  #   let(:end_date) { start_date.end_of_month }
    
  #   before do
  #     # Create a recurring availability rule
  #     @recurring_availability = create(
  #       :recurring_availability,
  #       start_time: "09:00",
  #       end_time: "10:00",
  #       speaker_id: 1,
  #       recurs_on: ->(date) { date.wday == 1 } # Recur every Monday
  #     )
  #   end

  #   it 'creates new availabilities for recurring rules' do
  #     expect {
  #       RecurringAvailabilityJob.new.perform(viewing_month, viewing_year)
  #     }.to change(Availability, :count).by(4) # Assuming 4 Mondays in January 2025
  #   end

  #   it 'does not create duplicates if availabilities already exist' do
  #     # First execution
  #     RecurringAvailabilityJob.new.perform(viewing_month, viewing_year)

  #     # Second execution
  #     expect {
  #       RecurringAvailabilityJob.new.perform(viewing_month, viewing_year)
  #     }.not_to change(Availability, :count)
  #   end
  # end
end
