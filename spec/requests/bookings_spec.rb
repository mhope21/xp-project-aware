require 'rails_helper'
# Cannot test until product_type and product_id are done
RSpec.describe "Bookings", type: :request do
  # let(:teacher) { create(:user, role: 'teacher') }
  # let(:event) { create(:event) }
  # let(:booking) { create(:booking, event: event) }
  # let(:order) { create(:order, user: teacher, booking: booking) }

  # before do
  #   sign_in teacher
  # end

  # describe "GET /bookings" do
  #   it "returns a list of bookings for the teacher" do
  #     get api_v1_bookings_path, headers: { "ACCEPT" => "application/json" }

  #     expect(response).to have_http_status(:ok)
  #     expect(response.content_type).to eq("application/json; charset=utf-8")
  #     expect(json.size).to eq(1)
  #   end
  # end

  # describe "POST /bookings" do
  #   it "creates a new booking" do
  #     post api_v1_bookings_path, params: { booking: { event_id: event.id, order_id: order.id, start_time: '2025-01-05 10:00:00', end_time: '2025-01-05 12:00:00', status: 'pending' } }, headers: { "ACCEPT" => "application/json" }

  #     expect(response).to have_http_status(:created)
  #     expect(json['event_id']).to eq(event.id)
  #     expect(json['order_id']).to eq(order.id)
  #     expect(json['start_time']).to eq('2025-01-05 10:00:00')
  #     expect(json['end_time']).to eq('2025-01-05 12:00:00')
  #     expect(json['status']).to eq('pending')
  #   end
  # end
end
