class WebhooksController < ApplicationController
  # Listens for events from Stripe and uses the data to create a donation
  def stripe
    payload = request.body.read
    sig_header = request.env["HTTP_STRIPE_SIGNATURE"]
    event = nil

    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, Rails.application.credentials.dig(:stripe, :webhook_secret)
      )
    rescue JSON::ParserError => e
      render json: { error: "Invalid payload" }, status: 400
      return
    rescue Stripe::SignatureVerificationError => e
      render json: { error: "Invalid signature" }, status: 400
      return
    end

    case event["type"]
    when "checkout.session.completed"
      session = event["data"]["object"]
      handle_checkout_session(session)
    end

    render json: { message: "success" }
  end

  private

  def handle_checkout_session(session)
    user_email = session.metadata.user_email
    user = User.find_by(email: user_email)

    donation = Donation.find_by(stripe_checkout_session_id: session.id)
    if donation
      donation.update(payment_status: "completed", stripe_payment_intent_id: session.payment_intent)
    else
      Donation.create(
        user: user,
        amount: session.amount_total / 100.0, # Convert back to dollars for the database
        payment_status: "completed",
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        canceled: false
      )
    end
  end
end
