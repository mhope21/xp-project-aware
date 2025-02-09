class Api::V1::DonationsController < ApplicationController
  load_and_authorize_resource except: [ :success, :cancel ]

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
    Stripe.api_key = Rails.application.credentials.dig(:stripe, :secret_key)

    amount = donation_params[:amount].to_i * 100 # Convert to cents for Stripe

    customer = Stripe::Customer.create({
      email: current_user.email,
      name: current_user.name
    })

    session = Stripe::Checkout::Session.create(
      payment_method_types: [ "card" ],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Donation"
          },
          unit_amount: amount
        },
        quantity: 1
      } ],
      mode: "payment",
      success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel?session_id={CHECKOUT_SESSION_ID}",
      customer: customer.id,
      metadata: {
        user_email: current_user.email,
        name: current_user.name
      }
    )

    render json: { id: session.id }, status: :created
  rescue Stripe::StripeError => e
    render json: { error: e.message }, status: :unprocessable_entity
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

  # GET /api/v1/donations/success
  def success
    session_id = params[:session_id]
    Stripe.api_key = Rails.application.credentials.dig(:stripe, :secret_key)
    session = Stripe::Checkout::Session.retrieve(session_id)
    donation = Donation.find_by(stripe_checkout_session_id: session_id)


    if donation
      donation.update(payment_status: "completed", stripe_payment_intent_id: session.payment_intent)
    end

    render json: { message: "Donation successful", donation: donation, session: session }
  rescue Stripe::StripeError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # GET /api/v1/donations/cancel
  def cancel
    session_id = params[:session_id] # This would be passed in the cancel URL if you want to track which donation was canceled
    donation = Donation.find_by(stripe_checkout_session_id: session_id)

    if donation
      # Update the donation status to canceled
      donation.update(payment_status: "canceled")
    end

    render json: { message: "Donation canceled", donation: donation }
  end


  private

  def donation_params
    params.require(:donation).permit(:user_id, :amount, :payment_status, :stripe_checkout_session_id, :stripe_payment_intent_id)
  end
end
