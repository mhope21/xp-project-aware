class BookingMailer < ApplicationMailer
  default from: "no-reply@example.com"

  def booking_confirmation(user, booking)
    @user = user
    @booking = booking
    @order = @booking.order
    mail(to: @user.email, subject: "Booking Request Confirmation") do |format|
      format.text { render plain: "Thank you for your booking request! We have received it and will review it shortly." }
      format.html { render html: "<h1>Booking Request Confirmation</h1><p>Thank you for your booking request! We have received it and will review it shortly.</p>".html_safe }
    end
  end

  def new_booking_notification(speaker, booking)
    @speaker = speaker
    @booking = booking
    @order = @booking.order
    mail(to: @speaker.email, subject: "New Booking Request") do |format|
      format.text { render plain: "You have a new booking request. Please review the details." }
      format.html { render html: "<h1>New Booking Request</h1><p>You have a new booking request. Please review the details.</p>".html_safe }
    end
  end

  def booking_modified_notification(speaker, booking)
    @speaker = speaker
    @booking = booking
    mail(to: @speaker.email, subject: "Booking Request Modified") do |format|
      format.text { render plain: "Your booking request has been modified. Please check the updated details." }
      format.html { render html: "<h1>Booking Request Modified</h1><p>Your booking request has been modified. Please check the updated details.</p>".html_safe }
    end
  end

  def booking_accepted_notification(user, booking)
    @user = user
    @booking = booking
    mail(to: @user.email, subject: "Booking Request Accepted") do |format|
      format.text { render plain: "The booking status is #{@booking.status}. Please visit your profile for details." }
      format.html { render html: "<h1>Your booking has been accepted</h1><p>Details: The booking status is #{@booking.status}. Please visit your profile for details.</p>".html_safe }
    end
  end

  def booking_denied_notification(user, booking)
    @user = user
    @booking = booking
    mail(to: @user.email, subject: "Booking Request Denied") do |format|
      format.text { render plain: "We regret to inform you that your booking has been declined." }
      format.html { render html: "<h1>Your booking has been declined</h1><p>We regret to inform you that your booking has been declined.</p>".html_safe }
    end
  end
end
