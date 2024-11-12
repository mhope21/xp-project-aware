# Until I get Stripe functional, this module handles the simulation of payment processing.
class MockPaymentProcessor
  def self.process(amount, credit_card_info, save_payment_info)
    if amount > 0
      # To simulate successful payment
      token = save_payment_info ? SecureRandom.hex(16) : nil   # Generates a random hex token if payment info should be saved or returns nil

      if save_payment_info
        puts "Payment token generated: #{token}"
      end

      # Return a combined response
      { success: true, token: save_payment_info ? token : nil, message: "Payment successful!" }
    else
      # To simulate failed payment
      { success: false, message: "Payment failed. Invalid amount." }
    end
  end
end
