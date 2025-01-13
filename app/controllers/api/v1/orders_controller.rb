class Api::V1::OrdersController < ApplicationController
  load_and_authorize_resource

  # GET /api/v1/orders
  def index
    render json: @orders, status: :ok
  end

  # POST /api/v1/orders
  def create
    ActiveRecord::Base.transaction do
      if params[:product_type] == "Booking"
        # Create the booking for a speaker event
        @booking = Booking.new(
          event_id: params[:event_id],
          start_time: params[:start_time],
          end_time: params[:end_time],
          status: "pending"  # You can change this based on your logic
        )

        unless @booking.save
          raise ActiveRecord::Rollback, "Failed to create booking"
        end

        # Create the order for the booking (excluding irrelevant params)
        booking_order_params = order_params.except(:start_time, :end_time, :event_id, :status)
        @order = Order.new(booking_order_params)

        unless @order.save
          raise ActiveRecord::Rollback, "Failed to create order for booking"
        end

      elsif params[:product_type] == "Kit"
        # Handle kit order creation (excluding irrelevant params)
        kit_order_params = order_params.except(:start_time, :end_time, :event_id, :status)
        @order = Order.new(kit_order_params)

        unless @order.save
          raise ActiveRecord::Rollback, "Failed to create kit order"
        end
      else
        raise ActiveRecord::Rollback, "Invalid product type"
      end
    end

    # If everything is successfully created, respond with the created order (and booking if it's a booking)
    if params[:product_type] == "Booking"
      render json: { booking: @booking, order: @order }, status: :created
    else
      render json: { order: @order }, status: :created
    end

  rescue ActiveRecord::Rollback => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # GET /api/v1/orders/:id
  def show
    render json: @order, status: :ok
  end

  # PATCH/PUT /api/v1/orders/:id
  def update
    if @order.update(order_params)
      render json: @order, status: :ok
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/orders/:id
  def destroy
    @order.destroy
    render json: { message: "Order successfully deleted." }, status: :no_content
  end


  private

  def order_params
    params.require(:order).permit(:user_id, :phone, :school_year, :product_id, :product_type, :address_id, :comments, :start_time, :event_id, :end_time, :status, address_attributes: [ :id, :street_address, :city, :state, :postal_code, :save_to_user, :addressable_type, :addressable_id, :_destroy ])
  end
end
