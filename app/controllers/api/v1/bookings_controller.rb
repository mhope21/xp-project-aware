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
    unless current_user.teacher?
      render json: { error: "Only teachers are allowed to create bookings" }, status: :forbidden
      return
    end

    @booking = Booking.new(booking_params)
    @booking.user = current_user

    if @booking.save
      render json: @booking, status: :created
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def update
    unless current_user.teacher? || current_user.speaker?
      render json: { error: "Only teachers are allowed to create bookings" }, status: :forbidden
      return
    end

    availability = @booking.availability

    if booking_params[:start_time].present? && booking_params[:end_time].present?
      start_time = booking_params[:start_time].to_time
      end_time = booking_params[:end_time].to_time

      if start_time < availability.start_time || end_time > availability.end_time
        render json: { error: "Booking times must be within the availability window" }, status: :unprocessable_entity and return
      end
    end

    if @booking.update(booking_params)
      render json: @booking
    else
      render json: { errors: @booking.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def booking_params
    params.require(:booking).permit(:event_id, :user_id, :start_time, :end_time, :status, :availability_id)
  end
end
