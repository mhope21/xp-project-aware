class Api::V1::AvailabilitiesController < ApplicationController
  before_action :set_availability, only: [ :show, :update, :destroy ]

  def index
    # This shows the availabilities including recurring availabilities for the month
    # and year sent in the request from the frontend or a default month and year.

    viewing_month = params[:month].to_i || Date.today.month
    viewing_year = params[:year].to_i || Date.today.year

    puts "Received Year: #{params[:year]}, Month: #{params[:month]}"  # Debugging the incoming params


    # Debugging the parsed values of year and month
    puts "Parsed Year: #{viewing_year}, Month: #{viewing_month}"

    # Handling cases where the month or year might be invalid (e.g., 0 or nil)
    if viewing_month == 0 || viewing_year == 0
      puts "Invalid date parameters, setting to current date."  # Debugging invalid date handling
      viewing_month = Date.today.month
      viewing_year = Date.today.year
    end

    # Debugging the final year and month values used for date calculation
    puts "Final Year: #{viewing_year}, Month: #{viewing_month}"

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
    render json: @availabilities
  end


  def show
    render json: @availability
  end

  def create
    @availability = Availability.new(availability_params)

    if @availability.save
      render json: @availability, status: :created
    else
      render json: { errors: @availability.errors.full_messages }, status: :unprocessable_entity
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
