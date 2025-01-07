require 'rails_helper'

RSpec.describe "Bookings", type: :request do
  let(:teacher) { create(:user, role: 'teacher') }
  let(:event) { create(:event) }
  let(:booking) { create(:booking, event: event) }
  let(:order) { create(:order, user: teacher) }

  before do
    sign_in teacher
  end

  describe "GET /bookings" do
    it "returns a list of bookings for the teacher" do
      sign_in teacher
      get api_v1_bookings_path, headers: { 'Authorization': "Bearer #{@auth_token}" }

      expect(response).to have_http_status(:ok)
      expect(response.content_type).to eq("application/json; charset=utf-8")
      expect(json.size).to eq(1)
    end
  end

  describe "POST /bookings" do
    it "creates a new booking" do
      sign_in teacher
      post api_v1_bookings_path, params: { booking: { event_id: event.id, order_id: order.id, start_time: '2025-01-05 10:00:00', end_time: '2025-01-05 12:00:00', status: 'pending' } }, headers: { 'Authorization': "Bearer #{@auth_token}" }

      expect(response).to have_http_status(:created)
      expect(json['event_id']).to eq(event.id)
      expect(json['order_id']).to eq(order.id)
      expect(json['start_time']).to eq('2025-01-05 10:00:00')
      expect(json['end_time']).to eq('2025-01-05 12:00:00')
      expect(json['status']).to eq('pending')
    end
  end
end
