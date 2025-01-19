require 'rails_helper'

RSpec.describe "Bookings", type: :request do
  let(:admin_user) { create(:user, :admin_user) }
  let(:teacher_user) { create(:user, :teacher_user) }
  let(:speaker_user) { create(:user, :speaker_user) }
  let(:availability) { create(:availability, start_time: Time.now, end_time: Time.now + 2.hours) }
  let(:event) { create(:event, speaker: speaker_user) }
  let(:order) { create(:order, user: teacher_user) }
  let(:booking) { create(:booking, event: event, availability: availability, start_time: Time.now + 30.minutes,
  end_time: Time.now + 1.hour, status: :pending) }


  subject(:ability) { Ability.new(teacher) }

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
          start_time: Time.now.iso8601,
          end_time: (Time.now + 1.hour).iso8601,
          status: :pending
        }
      }

      post api_v1_bookings_path, params: booking_params, headers: { 'Authorization': "Bearer #{@auth_token}" }

      expect(response).to have_http_status(:created)
      # expect(json_response['event_id']).to eq(event.id)
      # expect(json_response['status']).to eq('pending')
    end
  end

  def json_response
    JSON.parse(response.body)
  end
end
