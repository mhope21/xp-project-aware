class Api::V1::BookingsController < ApplicationController
  load_and_authorize_resource

  def index
    @bookings = Booking.accessible_by(current_ability)
    render json: @bookings
  end

  def show
    render json: @booking
  end

  def create
    @booking = Booking.new(booking_params)
    @booking.user = current_user

    if @booking.save
      render json: @booking, status: :created
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def update
    availability = booking.availability

    if @booking.update(booking_params)
      render json: @booking
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  private

  def booking_params
    params.require(:booking).permit(:event_id, :availability_id, :start_time, :end_time, :status)
  end
end
