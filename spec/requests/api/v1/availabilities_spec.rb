require 'rails_helper'

RSpec.describe "Api::V1::Availabilities", type: :request do
  let(:speaker) { create(:user, role: "speaker") }
  let!(:availabilities) { create_list(:availability, 3, speaker: speaker) }
  let(:availability_id) { availabilities.first.id }
  let(:recurring_availability) { create(:recurring_availability) }
  let(:year) { Time.current.year }
  let(:month) { Time.current.month }

  # Valid attributes with a valid start_time and end_time within the specified month and year
  let(:valid_attributes) do
    {
      start_time: Faker::Time.between_dates(from: Date.new(year, month, 1), to: Date.new(year, month, 15), period: :morning),
      end_time: Faker::Time.between_dates(from: Date.new(year, month, 16), to: Date.new(year, month, -1), period: :evening),
      speaker_id: speaker.id,
      recurring_availability_id: recurring_availability.id
    }
  end

  # Invalid attributes with start_time after end_time within the specified month and year
  let(:invalid_attributes) do
    {
      start_time: Faker::Time.between_dates(from: Date.new(year, month, 16), to: Date.new(year, month, -1), period: :evening),
      end_time: Faker::Time.between_dates(from: Date.new(year, month, 1), to: Date.new(year, month, 15), period: :morning),
      speaker_id: speaker.id,
      recurring_availability_id: recurring_availability.id
    }
  end

  # Update attributes with a valid end_time
  let(:update_attributes) do
    {
      end_time: Faker::Time.between_dates(from: Date.new(year, month, 16), to: Date.new(year, month, -1), period: :evening)
    }
  end

  describe 'GET /api/v1/availabilities' do
    it 'returns all availabilities' do
      get '/api/v1/availabilities', params: { year: year, month: month }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET /api/v1/availabilities/:id' do
    context 'when the record exists' do
      it 'returns the availability' do
        get "/api/v1/availabilities/#{availability_id}"
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['id']).to eq(availability_id)
      end
    end

    context 'when the record does not exist' do
      it 'returns a 404 status' do
        get '/api/v1/availabilities/0'
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /api/v1/availabilities' do
    context 'when the request is valid' do
      it 'creates an availability' do
        post '/api/v1/availabilities', params: { availability: valid_attributes, year: year, month: month }, as: :json
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['speaker_id']).to eq(speaker.id)
      end
    end

    context 'when the request is invalid' do
      it 'returns a 422 status with validation errors' do
        post '/api/v1/availabilities', params: { availability: invalid_attributes, year: year, month: month }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors']).to include("Start time must be before the end time")
      end
    end
  end

  describe 'PUT /api/v1/availabilities/:id' do
    context 'when the record exists' do
      it 'updates the availability' do
        put "/api/v1/availabilities/#{availability_id}", params: { availability: update_attributes }, as: :json
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['end_time']).to eq(update_attributes[:end_time].utc.iso8601(3))
      end
    end

    context 'when the record does not exist' do
      it 'returns a 404 status with an error message' do
        put "/api/v1/availabilities/0", params: { availability: update_attributes }, as: :json
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('Availability not found')
      end
    end
  end

  describe 'DELETE /api/v1/availabilities/:id' do
    context 'when the record exists' do
      it 'deletes the availability' do
        expect {
          delete "/api/v1/availabilities/#{availability_id}"
        }.to change(Availability, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when the record does not exist' do
      it 'returns a 404 status with an error message' do
        delete "/api/v1/availabilities/0"
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('Availability not found')
      end
    end
  end
end
