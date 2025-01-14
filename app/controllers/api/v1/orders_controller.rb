class Api::V1::OrdersController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user!

  # GET /api/v1/orders
  def index
    render json: @orders, status: :ok
  end

  # POST /api/v1/orders
  def create
    # Validate required fields
    if params[:event_id].blank? || params[:start_time].blank? || params[:end_time].blank?
      return render json: { error: "Missing required fields" }, status: :unprocessable_entity
    end

    ActiveRecord::Base.transaction do
      if params[:product_type] == "Booking"
        # Create the booking for a speaker event
        @booking = Booking.new(
          event_id: params[:event_id],
          start_time: params[:start_time],
          end_time: params[:end_time],
          status: "pending"  # Default status
        )

        unless @booking.save
          logger.error "Booking creation failed: #{@booking.errors.full_messages.join(', ')}"
          raise ActiveRecord::Rollback, "Failed to create booking"
        end

        # Now that the booking is saved, create the order with the booking's product_id
        booking_order_params = order_params.except(:start_time, :end_time, :event_id, :status)
        @order = Order.new(booking_order_params.merge(product_id: @booking.id))

        unless @order.save
          logger.error "Order creation failed: #{@order.errors.full_messages.join(', ')}"
          raise ActiveRecord::Rollback, "Failed to create order for booking"
        end

      elsif params[:product_type] == "Kit"
        # Handle kit order creation
        kit_order_params = order_params.except(:start_time, :end_time, :event_id, :status)
        @order = Order.new(kit_order_params)

        unless @order.save
          logger.error "Kit order creation failed: #{@order.errors.full_messages.join(', ')}"
          raise ActiveRecord::Rollback, "Failed to create kit order"
        end
      else
        logger.error "Invalid product type: #{params[:product_type]}"
        raise ActiveRecord::Rollback, "Invalid product type"
      end
    end

    # If everything is successfully created, respond with the created order (and booking if it's a booking)
    if params[:product_type] == "Booking"
      render json: { booking: @booking, order: @order, message: "Booking and order created successfully" }, status: :created
    else
      render json: { order: @order, message: "Kit order created successfully" }, status: :created
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
      associate_address_with_user(@order)
      render json: @order, status: :ok
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/orders/:id
  def destroy
    @order.destroy
    render json: { message: "Order successfully deleted." }, status: :no_content
  end


  private

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:user_id, :phone, :school_year, :product_id, :product_type, :address_id, :comments, address_attributes: [ :id, :street_address, :city, :state, :postal_code, :save_to_user, :addressable_type, :addressable_id, :_destroy ])
  end

  def associate_address_with_user(order)
    if order.address && order.user
      # Add a condition to check if the address should be saved to user
      if order.address.save_to_user
        unless order.user.addresses.exists?(order.address.id)
          order.user.addresses << order.address
        end
      end
    end
  end
end
