class Api::V1::DonationsController < ApplicationController
  load_and_authorize_resource

  # GET /api/v1/donations
  def index
    @donations = Donation.active
    render json: @donations, status: :ok
  end

  # GET /api/v1/donations/1
  def show
    @donation = Donation.active.find(params[:id])
    render json: @donation
  end

  # POST /api/v1/donations
  def create
    payment_token = params[:donation][:payment_token][0]
    @donation = Donation.new(donation_params.merge(canceled: false))
    @donation.user = @current_user

    # Process the payment
    payment_result = MockPaymentProcessor.process(@donation.amount, payment_token, params[:donation][:save_payment_info])
    Rails.logger.info("Payment Processor Response: #{payment_result.inspect}")
    Rails.logger.info("Payment Token Before Assignment: #{payment_result[:token].inspect}")

    if payment_result[:success]
      @donation.payment_status = "successful"
      @donation.payment_token = payment_result[:token].to_s
      Rails.logger.info("Assigned Payment Token: #{@donation.payment_token}")

      if @donation.save  # Save the donation record
        render json: @donation, status: :created
      else
        Rails.logger.error("Donation Errors: #{@donation.errors.full_messages}")
        render json: { error: @donation.errors.full_messages }, status: :unprocessable_entity
      end
    else
      @donation.payment_status = "failed"
      render json: { error: payment_result[:message] }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/donations/1
  def update
    @donation = Donation.find(params[:id])
    if @donation.update(donation_params)
      render json: @donation, status: :ok
    else
      render json: { error: @donation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE api/v1/donations/1
  def destroy
    donation = Donation.find(params[:id])
    if donation.update(canceled: true)
      render json: { message: "Donation successfully canceled" }, status: :ok
    else
      render json: { errors: donation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def donation_params
    params.require(:donation).permit(:user_id, :amount, :payment_status, :save_payment_info, :payment_token)
  end
end
