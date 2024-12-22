class Api::V1::OrdersController < ApplicationController
  load_and_authorize_resource

  # GET /api/v1/orders
  def index
    render json: @orders, status: :ok
  end

  # POST /api/v1/orders
  def create
    @order = Order.new(order_params)

    # Associate user and check if role is teacher
    if current_user.role == "teacher" && @order.save
      render json: @order, status: :created
    else
      if current_user.role != "teacher"
        render json: { error: "Only teachers can create orders" }, status: :forbidden
      else
        render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  # GET /api/v1/orders/:id
  def show
    @order = Order.includes(:address).find(params[:id]) # Preload address
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
    params.require(:order).permit(:phone, :school_year, :kit_id, :comments)
  end
end
