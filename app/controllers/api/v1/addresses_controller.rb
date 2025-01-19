class Api::V1::AddressesController < ApplicationController
  before_action :set_addressable

  def create
    @address = @addressable.addresses.build(address_params)
    if @address.save
      render json: @address, status: :created
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  def update
    @address = @addressable.addresses.find(params[:id])
    if @address.update(address_params)
      render json: @address, status: :ok
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @address = @addressable.addresses.find(params[:id])
    @address.destroy
    head :no_content
  end

  private

  def set_addressable
    if params[:user_id]
      @addressable = User.find(params[:user_id])
    elsif params[:organization_id]
      @addressable = Organization.find(params[:organization_id])
    else
      render json: { error: "User or Organization must be provided" }, status: :unprocessable_entity
    end
  end

  def address_params
    params.require(:address).permit(:street_address, :city, :state, :postal_code, :save_to_user, :addressable_id, :addressable_type)
  end
end
