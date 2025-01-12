require 'rails_helper'

RSpec.describe "Bookings", type: :request do
  let(:admin_user) { create(:user, :admin_user) }
  let(:teacher_user) { create(:user, :teacher_user) }
  let(:speaker_user) { create(:user, :speaker_user) }
  let(:event) { create(:event, speaker: speaker_user, duration: 30) }
  let(:availability) { create(:availability, start_time: Time.now, end_time: Time.now + 2.hours) }
  let(:booking) { create(:booking, event: event, availability: availability, start_time: availability.start_time + 30.minutes, end_time: availability.start_time + 30.minutes + event.duration, user: teacher_user, status: :pending) }

  before do
    sign_in teacher_user
  end

  describe "GET /bookings" do
    it "returns a list of bookings for the teacher" do
      get api_v1_bookings_path, headers: { 'Authorization': "Bearer #{@auth_token}" }

      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /bookings" do
    it "creates a new booking" do
      booking_params = {
        booking: {
          event_id: event.id,
          availability_id: availability.id,
          start_time: Time.now + 30.minutes,
          end_time: Time.now + 30.minutes + event.duration,
          status: :pending
        }
      }

      post api_v1_bookings_path, params: booking_params, headers: { 'Authorization': "Bearer #{@auth_token}" }

      expect(response).to have_http_status(:created)
      expect(json_response['event_id']).to eq(event.id)
      expect(json_response['status']).to eq('pending')
    end
  end

  describe "PATCH #update" do
    it "updates successfully when times are within availability" do
      patch api_v1_booking_path(booking), params: {
        booking: { start_time: availability.start_time + 1.hour }
      }, headers: { 'Authorization': "Bearer #{@auth_token}" }
      expect(response).to have_http_status(:ok)
    end

    it "fails to update when times are outside availability" do
      patch api_v1_booking_path(booking), params: {
        booking: { start_time: Time.now - 30.minutes, end_time: Time.now + 1.hour }
      }, headers: { 'Authorization': "Bearer #{@auth_token}" }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to eq("Booking times must be within the availability window")
    end
  end

  def json_response
    JSON.parse(response.body)
  end
end
