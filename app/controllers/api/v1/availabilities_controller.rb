class Api::V1::AvailabilitiesController < ApplicationController
  before_action :set_availability, only: [ :show, :update, :destroy ]

  def index
    if params[:year].present? && params[:month].present?
      begin
        year = params[:year].to_i
        month = params[:month].to_i

        # Generate the start and end of the month
        start_date = DateTime.new(year, month, 1).beginning_of_day
        end_date = start_date.end_of_month

        availabilities = Availability.where(start_time: start_date..end_date)
      rescue Date::Error
        return render json: { error: "Invalid date parameters" }, status: :unprocessable_entity
      end
    else
      availabilities = Availability.all
    end

    render json: availabilities, status: :ok
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
      puts JSON.parse(response.body)["errors"]
    end
  end

  def update
    if @availability.update(availability_params)
      render json: @availability, status: :ok
    else
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
