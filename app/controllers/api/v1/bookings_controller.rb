class Api::V1::BookingsController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user
  before_action :set_booking, only: [ :show, :update, :destroy ]

  def index
    if params[:user_id]
      @bookings = Booking.where(user_id: params[user.id])
    else
      @bookings = Booking.accessible_by(current_ability)
    end
    render json: @bookings
  end

  def show
    render json: @booking
  end

  def create
    @booking = Booking.new(booking_params)
    @booking.user = current_user
      if @booking.save
        availability = Availability.find(@booking.availability_id)
        availability.update(booked: true)
        render json: @booking.as_json(include: :event), status: :created
      else
        render json: @booking.errors, status: :unprocessable_entity
      end
  end

  def update
    @booking = Booking.find(params[:id])
    @availability = @booking.availability

    if @booking.status == "pending"
      if current_user.role == "teacher"
        # Ensure the update is within the original availability times
        if params[:start_time] >= @availability.start_time && params[:end_time] <= @availability.end_time
          if @booking.update(booking_params)
            render json: @booking
          else
            render json: @booking.errors, status: :unprocessable_entity
          end
        else
          render json: { error: "New times are not within the original availability times." }, status: :unprocessable_entity
        end
      elsif current_user.role == "speaker"
        # Ensure the status update is valid
        if params[:status] && [ "pending", "confirmed", "declined" ].include?(params[:status])
          @booking.status = params[:status]
          if @booking.save
            render json: @booking
          else
            render json: @booking.errors, status: :unprocessable_entity
          end
        else
          render json: { error: "Invalid status value." }, status: :unprocessable_entity
        end
      else
        render json: { error: "User does not have permission to update." }, status: :unprocessable_entity
      end
    else
      render json: { error: "Booking cannot be modified once it is accepted or declined." }, status: :unprocessable_entity
    end
  end

  private

  def set_booking
    @booking = Booking.find(params[:id])
  end

  def booking_params
    params.require(:booking).permit(:event_id, :availability_id, :start_time, :end_time, :status)
  end
end
