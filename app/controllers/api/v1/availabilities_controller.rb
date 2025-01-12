class Api::V1::AvailabilitiesController < ApplicationController
  before_action :set_availability, only: [ :show, :update, :destroy ]

  def index
    viewing_month = params[:month].to_i || Date.today.month
    viewing_year = params[:year].to_i || Date.today.year
    speaker_id = params[:speaker_id]

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

    # Fetch the availabilities within the specified date range
    @availabilities = Availability.where(start_time: start_date..end_date)
    @availabilities = @availabilities.where(speaker_id: speaker_id) if speaker_id.present?

    render json: @availabilities
  end


  def show
    render json: @availability
  end

  def create
    speaker = Speaker.find(params[:speaker_id])
    new_availability = speaker.availabilities.create(availability_params)

    if new_availability.save
      render json: new_availability, status: :created
    else
      render json: { error: new_availability.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @availability.update(availability_params)
      render json: @availability, status: :ok
    else
      puts @availability.errors.full_messages  # Add this line to log validation errors
      render json: { errors: @availability.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @availability.destroy
    head :no_content
  end

  private

  def set_availability
    @availability = Availability.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Availability not found" }, status: :not_found
  end

  def availability_params
    params.require(:availability).permit(:start_time, :end_time, :speaker_id, :recurring_availability_id)
  end
end
