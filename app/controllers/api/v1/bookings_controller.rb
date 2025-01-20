class Api::V1::BookingsController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user!
  before_action :set_booking, only: [ :show, :update ]

  def index
    if params[:user_id]
      @bookings = Booking.includes(:event).where(user_id: params[user.id])
    else
      @bookings = Booking.includes(:event).accessible_by(current_ability)
    end
    render json: BookingSerializer.new(@bookings).serializable_hash.to_json
  end

  def show
    render json: BookingSerializer.new(@booking).serializable_hash.to_json
  end

  def create
    @booking = Booking.new(booking_params)
    @booking.user = current_user

      if @booking.save
        availability = Availability.find(@booking.availability_id)
        availability.update(booked: true)

        begin
          BookingMailer.booking_confirmation(@booking.user, @booking).deliver_now
          BookingMailer.new_booking_notification(@booking.speaker, @booking).deliver_now
        rescue => e
          Rails.logger.error("Mailer error: #{e.message}")
        end

        render json: BookingSerializer.new(@booking).serializable_hash, status: :created
        Rails.logger.info("Response: #{BookingSerializer.new(@booking).serializable_hash}")

      else
        Rails.logger.error("Failed to update availability for Booking ID: #{@booking.id}")
        render json: { error: "Failed to update availability." }, status: :unprocessable_entity
      end
  end

  def update
    @booking = Booking.find(params[:id])
    @availability = @booking.availability

    Rails.logger.info("Updating booking with ID: #{@booking.id}")
    Rails.logger.info("Availability ID: #{@availability.id}")
    Rails.logger.info("Params: #{params.inspect}")
    Rails.logger.info("Booking Times - Start: #{params[:start_time]}, End: #{params[:end_time]}")
    Rails.logger.info("Availability Times - Start: #{@availability.start_time}, End: #{@availability.end_time}")
    Rails.logger.info("Current booking status: #{@booking.status}")



    if @booking.status == "pending"
      if current_user.role == "teacher"
        handle_teacher_update
      elsif current_user.role == "speaker"
        handle_speaker_update
      else
        render json: { error: "User does not have permission to update." }, status: :unprocessable_entity
      end
    else
      render json: { error: "Booking cannot be modified once it is accepted or declined." }, status: :unprocessable_entity
    end
  end

  def bookings_by_speaker
    # Find all events that have the given speaker_id
    events = Event.where(speaker_id: params[:speaker_id])

    # Fetch all bookings related to those events
    @bookings = Booking.where(event_id: events.pluck(:id))

    # Render the bookings as JSON
    render json: BookingSerializer.new(@bookings).serializable_hash.to_json
  end

  private

  def handle_teacher_update
    if @booking.update(booking_params)
      BookingMailer.booking_modified_notification(@booking.speaker, @booking).deliver_now
      render json: BookingSerializer.new(@booking).serializable_hash.to_json
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def handle_speaker_update
    if valid_status_update?
      case params[:status]
      when "confirmed"
        if @booking.accept!
          render json: { message: "Booking accepted successfully.", booking: BookingSerializer.new(@booking).serializable_hash }, status: :ok
        else
          render json: { error: "Failed to accept booking." }, status: :unprocessable_entity
        end
      when "denied"
        if @booking.denied!
          render json: { message: "Booking denied successfully.", booking: BookingSerializer.new(@booking).serializable_hash }, status: :ok
        else
          render json: { error: "Failed to decline booking." }, status: :unprocessable_entity
        end
      else
        render json: { error: "Unsupported status update." }, status: :unprocessable_entity
      end
    else
      render json: { error: "Invalid status value." }, status: :unprocessable_entity
    end
  end

  def valid_status_update?
    params[:status] && %w[pending confirmed denied].include?(params[:status])
  end

  def set_booking
    @booking = Booking.includes(:event).find(params[:id])
  end

  def booking_params
    params.require(:booking).permit(:event_id, :availability_id, :start_time, :end_time, :status)
  end
end
