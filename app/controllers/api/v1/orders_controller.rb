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

    if params[:order][:product_type].blank?
      return render json: { error: "Missing required fields" }, status: :unprocessable_entity
    end

    # Handle order creation for different product types
    case params[:order][:product_type]
    when "Booking"
      create_booking_order
    when "Kit"
      create_kit_order
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

  def create_booking_order
    # Check if address information is provided (either address_id or address_attributes)
    unless params[:order][:address_id].present? || params[:order][:address_attributes].present?
      return render json: { error: "Address information is required" }, status: :unprocessable_entity
    end

    booking = Booking.find_by(id: params[:product_id])
    unless booking
      return render json: { error: "Booking not found" }, status: :not_found
    end

    @order = Order.new(order_params.merge(product_id: booking.id))
    unless @order.save
      return render json: { error: @order.errors.full_messages }, status: :unprocessable_entity
    end

    associate_address_with_user(@order)
    render json: { order: @order, message: "Booking order created successfully" }, status: :created
  end

  def create_kit_order
    Rails.logger.info("Starting create_kit_order...")
    kit = Kit.find_by(id: params[:order][:product_id])
    unless kit
      return render json: { error: "Kit not found" }, status: :not_found
    end
    Rails.logger.info("Kit found: #{kit.inspect}")
    Rails.logger.info("Attempting to find or create address...")
    address = nil

    if order_params[:address_id].present?
      # Fetch the address by ID
      address = Address.find_by(id: order_params[:address_id])
      unless address
        return render json: { error: "Address not found with ID #{order_params[:address_id]}" }, status: :unprocessable_entity
      end
    else
      # Handle address creation or finding based on attributes
      begin
        address = find_or_create_address(order_params[:address_attributes])
      rescue ActiveRecord::RecordNotFound => e
        return render json: { error: e.message }, status: :unprocessable_entity
      end
    end

  Rails.logger.info("Address processed successfully: #{address.inspect}")
  # Now that the address is correctly handled, create the order with the address information
  Rails.logger.info("Creating order with product_id: #{kit.id} and address_id: #{address.id}")
  @order = Order.new(order_params.except(:address_attributes).merge(product_id: kit.id, address_id: address.id))
    unless @order.save
      Rails.logger.error("Failed to save order: #{@order.errors.full_messages}")
      return render json: { error: @order.errors.full_messages }, status: :unprocessable_entity
    end
    Rails.logger.info("Order created successfully: #{@order.inspect}")
    Rails.logger.info("Associating address with user if save_to_user is true...")
    associate_address_with_user(@order)
    Rails.logger.info("Address association complete.")
    Rails.logger.info("Kit order created successfully: #{@order.inspect}")
    render json: {
  order: @order.as_json(include: { product: { only: [ :name, :description ] } }),
  message: "Kit order created successfully"
}, status: :created
  end

  def set_order
    @order = Order.find(params[:id])
  end

  def order_params
    params.require(:order).permit(:user_id, :phone, :school_year, :product_id, :product_type, :address_id, :comments, address_attributes: [ :street_address, :city, :state, :postal_code, :save_to_user, :addressable_type, :addressable_id ])
  end

  def find_or_create_address(address_attributes)
    return nil if address_attributes.blank?

    permitted_attributes = address_attributes.permit(
      :street_address, :city, :state, :postal_code, :save_to_user, :addressable_type, :addressable_id
    )

    Address.find_or_create_by(
      street_address: permitted_attributes[:street_address],
      city: permitted_attributes[:city],
      state: permitted_attributes[:state],
      postal_code: permitted_attributes[:postal_code]
    ) do |address|
      address.assign_attributes(permitted_attributes)
      address.save_to_user = permitted_attributes[:save_to_user] if permitted_attributes[:save_to_user].present?
    end
  end

  def associate_address_with_user(order)
    return unless order.address && order.user

    existing_address = order.user.addresses.find_by(
      street_address: order.address.street_address,
      city: order.address.city,
      state: order.address.state,
      postal_code: order.address.postal_code
    )

    order.user.addresses << order.address unless existing_address
  end
end
