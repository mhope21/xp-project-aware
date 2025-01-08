class Api::V1::AvailabilitiesController < ApplicationController
  before_action :set_availability, only: [ :show, :update, :destroy ]

  def index
      # This shows the availabilities including recurring availibilities for the month
      # and year sent in the request from the frontend or a default month and year.
      viewing_month = params[:month].to_i || Date.today.month
      viewing_year = params[:year].to_i || Date.today.year
      start_date = DateTime.new(viewing_year, viewing_month, 1).beginning_of_day
      end_date = start_date.end_of_month.end_of_day

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
    @availability = Availability.find(params[:id])

    if @availability.update(availability_params)
      render json: @availability, status: :ok
    else
      # Make sure to return full error messages so they can be checked in the tests
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
    # rescue ActiveRecord::RecordNotFound
    #   render json: { error: "Availability not found" }, status: :not_found
  end

  def availability_params
    # We permit speaker_id, start_time, and end_time as per the model
    params.require(:availability).permit(:start_time, :end_time, :speaker_id, :recurring_availability_id)
  end
end
