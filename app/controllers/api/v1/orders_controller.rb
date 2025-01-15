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
    if params[:product_type].blank?
      return render json: { error: "Missing required fields" }, status: :unprocessable_entity
    end

    # Handle order creation for different product types
    case params[:product_type]
    when "Booking"
      # Booking-specific logic
      booking = Booking.find_by(id: params[:product_id])
      unless booking
        return render json: { error: "Booking not found" }, status: :not_found
      end

      # Create the order associated with the booking
      @order = Order.new(order_params.merge(product_id: booking.id))
      associate_address_with_user(@order)
      unless @order.save
        return render json: { error: @order.errors.full_messages }, status: :unprocessable_entity
      end

      render json: { order: @order, message: "Booking order created successfully" }, status: :created

    when "Kit"
      # Kit-specific logic
      kit = Kit.find_by(id: params[:product_id])
      unless kit
        return render json: { error: "Kit not found" }, status: :not_found
      end

      # Create the order associated with the kit
      @order = Order.new(order_params.merge(product_id: kit.id))
      unless @order.save
        return render json: { error: @order.errors.full_messages }, status: :unprocessable_entity
      end

      render json: { order: @order, message: "Kit order created successfully" }, status: :created

    else
      render json: { error: "Invalid product type" }, status: :unprocessable_entity
    end
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
