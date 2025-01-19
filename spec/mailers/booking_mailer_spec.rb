require "rails_helper"

RSpec.describe BookingMailer, type: :mailer do
  let(:organization) { create(:organization, addresses: addresses) }
  let(:addresses) { create_list(:address, 3, street_address: "123 St") }
  let(:speaker) { create(:user, :speaker_user) }

  describe "booking_confirmation" do
    let(:user) { create(:user) }
    let(:booking) { create(:booking, user: user) }
    let(:mail) { BookingMailer.booking_confirmation(user, booking) }

    it "creates booking request confirmation" do
      expect(mail.subject).to eql("Booking Request Confirmation")
      expect(mail.to).to eql([ user.email ])
      expect(mail.from).to eql([ "no-reply@example.com" ])
    end
  end

  describe "new_booking_notification" do
    let(:speaker) { create(:user, :speaker_user) }
    let(:booking) { create(:booking) }
    let(:mail) { BookingMailer.new_booking_notification(speaker, booking) }

    it "creates new booking notification" do
      expect(mail.subject).to eql("New Booking Request")
      expect(mail.to).to eql([ speaker.email ])
      expect(mail.from).to eql([ "no-reply@example.com" ])
    end
  end

  describe "booking_modified_notification" do
    let(:user) { create(:user, organization: organization) }
    let(:speaker) { create(:user, :speaker_user) }
    let(:booking) { create(:booking, user: user) }
    let(:mail) { described_class.booking_modified_notification(speaker, booking) }

    it "creates booking request modified notification" do
      expect(mail.subject).to eql("Booking Request Modified")
      expect(mail.to).to eql([ speaker.email ])
      expect(mail.from).to eql([ "no-reply@example.com" ])
    end

    it "renders an empty body" do
      expect(mail.body.encoded).to include("Booking Request Modified")
    end
  end
end
