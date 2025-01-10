require 'rails_helper'

RSpec.describe "Bookings", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:teacher) { create(:user, :teacher) }
  let(:speaker) { create(:user, :speaker_user) }
  let(:event) { create(:event, speaker: speaker) }
  let(:booking) { create(:booking, event: event) }

  subject(:ability) { Ability.new(teacher) }

  before do
    sign_in teacher
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
          start_time: Time.now,
          end_time: Time.now + 1.hour,
          status: :pending
        }
      }

      post api_v1_bookings_path, params: booking_params, headers: { 'Authorization': "Bearer #{@auth_token}" }

      expect(response).to have_http_status(:created)
      expect(json_response['event_id']).to eq(event.id)
      expect(json_response['status']).to eq('pending')
    end
  end

  def json_response
    JSON.parse(response.body)
  end
end
