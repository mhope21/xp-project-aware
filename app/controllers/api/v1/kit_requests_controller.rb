class Api::V1::KitRequestsController < ApplicationController
  load_and_authorize_resource

  # GET /api/v1/kit_requests
  def index
    render json: @kit_requests, status: :ok
  end

  # POST /api/v1/kit_requests
  def create
    @kit_request.user = current_user # Automatically associate user

    if @kit_request.save
      render json: @kit_request, status: :created
    else
      render json: { errors: @kit_request.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/kit_requests/:id
  def show
    render json: @kit_request, status: :ok
  end

  # PATCH/PUT /api/v1/kit_requests/:id
  def update
    if @kit_request.update(kit_request_params)
      render json: @kit_request, status: :ok
    else
      render json: { errors: @kit_request.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/kit_requests/:id
  def destroy
    @kit_request.destroy
    render json: { message: "Kit request successfully deleted." }, status: :no_content
  end


  private

  def kit_request_params
    params.require(:kit_request).permit(:phone, :school_name, :school_address, :school_year, :kit_id, :comments)
  end
end
