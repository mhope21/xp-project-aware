class Api::V1::AvailabilitiesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_availability, only: [ :show, :update, :destroy ]

  def index
    speaker_id = params[:speaker_id]
    viewing_month = params[:month].to_i || Date.today.month
    viewing_year = params[:year].to_i || Date.today.year

    # Handling cases where the month or year might be invalid (e.g., 0 or nil)
    if viewing_month == 0 || viewing_year == 0
      viewing_month = Date.today.month
      viewing_year = Date.today.year
    end

    begin
      # Create start and end date for the requested month and year
      start_date = DateTime.new(viewing_year, viewing_month, 1).beginning_of_day
      end_date = start_date.end_of_month.end_of_day
      puts "Start Date: #{start_date}, End Date: #{end_date}"  # Debugging start and end dates
    rescue => e
      # Catch any errors related to invalid date creation and log them
      puts "Error creating start or end date: #{e.message}"
    end

    # Trigger the job to create next month's availabilities if needed
    # trigger_recurring_availability_job(viewing_month, viewing_year)

    # Fetch the availabilities within the specified date range
    @availabilities = Availability.future.where(start_time: start_date..end_date)
    @availabilities = @availabilities.where(speaker_id: speaker_id) if speaker_id.present?
    @availabilities = @availabilities.where(booked: false)

    render json: @availabilities
  end


  def show
    render json: @availability
  end

  def create
    speaker_id = availability_params[:speaker_id]
    @speaker = User.find_by(id: speaker_id, role: "speaker")

    if @speaker.nil?
      return render json: { error: "Speaker not found" }, status: :not_found
    end

    # Check if the start_time is in the past
    start_time = availability_params[:start_time]
    if start_time.present? && start_time < Time.now
      return render json: { error: "Start time must be in the future" }, status: :unprocessable_entity
    end

    availability_attributes = availability_params.except(:is_recurring, :recurring_end_date)
    @availability = @speaker.availabilities.create!(availability_attributes)

    is_recurring = params[:availability][:is_recurring]

    if is_recurring
      recurring_end_date = params[:availability][:recurring_end_date]
      create_recurring_availability(@availability, recurring_end_date)
    end

    if @availability.persisted?
      render json: @availability, status: :created
    else
      render json: { errors: @availability.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /availabilities/:id
  def update
    availability = Availability.find(params[:id])

    if availability.update(availability_params)
      render json: availability, status: :ok
    else
      render json: { errors: availability.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /availabilities/:id
  def destroy
    if @availability.recurring_availability_id.present?
      recurring_availability = RecurringAvailability.find(@availability.recurring_availability_id)

      # Only delete recurring availability if there are no other associated availabilities
      recurring_availability.destroy if recurring_availability.availabilities.empty?
    end

    @availability.destroy
    head :no_content
  end

  private

  def create_recurring_availability(availability, recurring_end_date)
    recurring_end_date = recurring_end_date&.to_date
    recurring_availability = RecurringAvailability.create!(end_date: recurring_end_date)

    availability.update!(recurring_availability_id: recurring_availability.id)
  end

  def availability_params
    params.require(:availability).permit(:speaker_id, :start_time, :end_time, :is_recurring, :recurring_end_date, :booked)
  end

  def set_availability
    @availability = Availability.find_by(id: params[:id])
    render json: { error: "Availability not found" }, status: :not_found if @availability.nil?
  end


  def trigger_recurring_availability_job(viewing_month, viewing_year)
    # Calculate the next month and year based on the viewing month and year
    # next_month_date = Date.new(viewing_year, viewing_month, 1).next_month
    # next_month = next_month_date.month
    # next_year = next_month_date.year

    # Trigger the job for the next month
    RecurringAvailabilityJob.perform_later(viewing_month, viewing_year)
  end
end
