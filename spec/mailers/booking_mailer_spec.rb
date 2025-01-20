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

  describe "booking_accepted_notification and booking_denied_notification" do
    let(:user) { create(:user, email: "user@example.com", first_name: "John", last_name: "Doe") }
    let(:organization) { create(:organization, name: "Example Organization") }
    let(:address) { create(:address, organization: organization, street: "123 Main St", city: "Sample City", state: "SC", zip: "12345") }
    let(:booking) { create(:booking, user: user) }
    let(:address1) { create(:address) }
    let(:address2) { create(:address) }

    before do
      allow(booking.user).to receive(:organization).and_return(organization)
      allow(organization).to receive(:addresses).and_return([ address1, address2 ])
    end

    describe "#booking_accepted_notification" do
    let(:mail) { BookingMailer.booking_accepted_notification(user, booking) }

    it "sends to the correct email address" do
      expect(mail.to).to eq([ user.email ])
    end

    it "has the correct subject" do
      expect(mail.subject).to eq("Booking Request Accepted")
    end

    it 'includes the booking details in the body' do
      expect(mail.body.encoded).to include("Your booking has been accepted")

      expect(mail.body.encoded).to include("The booking status is confirmed. Please visit your profile for details.")
    end
  end

  describe "#booking_denied_notification" do
    let(:mail) { BookingMailer.booking_denied_notification(user, booking) }

    it "sends to the correct email address" do
      expect(mail.to).to eq([ user.email ])
    end

    it "has the correct subject" do
      expect(mail.subject).to eq("Booking Request Denied")
    end

    it 'includes the booking details in the body' do
      expect(mail.body.encoded).to include("Your booking has been declined")

      expect(mail.body.encoded).to include("We regret to inform you that your booking has been declined.")
    end
  end
end
end
