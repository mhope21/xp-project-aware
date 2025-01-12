class Api::V1::OrdersController < ApplicationController
  load_and_authorize_resource

  # GET /api/v1/orders
  def index
    render json: @orders, status: :ok
  end

  # POST /api/v1/orders
  def create
    @order = Order.new(order_params)
    # Automatically associate user
    @order.user = current_user
    if @order.save
      associate_address_with_user(@order)
      render json: @order, status: :created
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
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
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
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
    params.require(:order).permit(:phone, :address_id, :school_year, :comments, :product_id, :product_type, address_attributes: [:id, :street_address, :city, :state, :postal_code, :save_to_user, :_destroy])
  end

  def associate_address_with_user(order)
    if order.address && order.user
      if order.address.save_to_user
        unless order.user.addresses.exists?(order.address.id)
          order.user.addresses << order.address
        end   
      end
    end
end
end