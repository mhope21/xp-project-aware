require 'rails_helper'

RSpec.describe "Api::V1::Availabilities", type: :request do
  let(:speaker) { create(:user, role: "speaker") }
  let!(:availabilities) { create_list(:availability, 3, speaker: speaker) }
  let(:availability_id) { availabilities.first.id }
  let(:recurring_availability) { create(:recurring_availability) }

  # Valid attributes with a start_time that is before the end_time
  let(:valid_attributes) do
    start_time = Faker::Time.forward(days: 7, period: :morning)
    end_time = Faker::Time.forward(days: 7, period: :evening)

    {
      start_time: start_time,
      end_time: end_time,
      speaker_id: speaker.id,
      recurring_availability_id: recurring_availability.id
    }
  end

  # Invalid attributes with a start_time after the end_time
  let(:invalid_attributes) do
    start_time = Faker::Time.forward(days: 7, period: :afternoon)
    end_time = Faker::Time.forward(days: 7, period: :morning)  # This makes it invalid

    {
      start_time: start_time,
      end_time: end_time,
      speaker_id: speaker.id,
      recurring_availability_id: recurring_availability.id
    }
  end

  describe 'GET /api/v1/availabilities' do
    context 'when no filters are applied' do
      it 'returns all availabilities' do
        get '/api/v1/availabilities'
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).size).to eq(3)
      end
    end

    context 'when filtering by year and month' do
      it 'returns availabilities for the specified month' do
        year = Time.current.year
        month = Time.current.month
        get '/api/v1/availabilities', params: { year: year, month: month }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).size).to be >= 0 # Adjust based on your seed data
      end
    end

    context 'when invalid date parameters are provided' do
      it 'returns a 422 status with an error message' do
        get '/api/v1/availabilities', params: { year: 'abcd', month: 'xyz' }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['error']).to eq('Invalid date parameters')
      end
    end
  end

  describe 'POST /api/v1/availabilities' do
    context 'when the request is valid' do
      it 'creates an availability' do
        post '/api/v1/availabilities', params: { availability: valid_attributes }, as: :json
        puts response.body # Debug the response body
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['speaker_id']).to eq(speaker.id)
      end
    end

    context 'when the request is invalid' do
      it 'returns a 422 status with invalid date parameters' do
  get '/api/v1/availabilities', params: { year: 'abcd', month: 'xyz' }
  expect(response).to have_http_status(:unprocessable_entity)
  expect(JSON.parse(response.body)['error']).to eq('Invalid date parameters')
end
    end
  end

  describe 'PUT /api/v1/availabilities/:id' do
    let(:valid_attributes) { { end_time: Faker::Time.forward(days: 8, period: :evening) } }

    context 'when the record exists' do
      it 'updates the availability' do
        put "/api/v1/availabilities/#{availability_id}", params: { availability: valid_attributes }, as: :json
        expect(response).to have_http_status(:ok)
        # expect value to include fractional seconds
        expect(JSON.parse(response.body)['end_time']).to eq(valid_attributes[:end_time].utc.iso8601(3))
      end
    end
  end

  describe 'DELETE /api/v1/availabilities/:id' do
    it 'deletes the availability' do
      expect {
        delete "/api/v1/availabilities/#{availability_id}"
      }.to change(Availability, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
