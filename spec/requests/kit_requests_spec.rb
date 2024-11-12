require 'rails_helper'

RSpec.describe "KitRequests", type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:regular_user) { create(:user, :regular_user) }
  let(:kit) { create(:kit) }


  describe "GET /index" do
    it "returns a success response" do
      sign_in regular_user
      get api_v1_kit_requests_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /show" do
    let(:kit_request) { create(:kit_request, user: regular_user, kit: kit) }
    it "returns a success response" do
      sign_in regular_user
      get api_v1_kit_request_path(kit_request), headers: { 'Authorization': "Bearer #{@auth_token}" }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["school_name"]).to eq(kit_request.school_name)
    end
  end

  describe "POST /create" do
    let(:kit_request) { create(:kit_request, user: regular_user, kit: kit) }
    it "creates a new kit request" do
      sign_in regular_user
      expect {
        post api_v1_kit_requests_path, params: { kit_request: { school_year: "2025-2026", phone: "123-456-7890", school_name: "New School", school_address: "123 Main St, City, ST 12345", comments: "This is wonderful", kit_id: kit.id } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
      }.to change(KitRequest, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe "PATCH /update" do
    let(:kit_request) { create(:kit_request, user: regular_user, kit: kit) }
    it "updates the kit request" do
      sign_in regular_user
      patch api_v1_kit_request_path(kit_request), params: { kit_request: { school_name: "Updated School" } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
      expect(response).to have_http_status(:ok)
      expect(kit_request.reload.school_name).to eq("Updated School")
    end
  end

  describe "DELETE /destroy" do
    context "when user is an admin" do
      let(:kit_request) { create(:kit_request, user: admin_user, kit: kit) }
      it "deletes the kit request" do
        sign_in admin_user
        delete api_v1_kit_request_path(kit_request), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:no_content)
        expect { kit_request.reload }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context "when user is not an admin" do
      let(:kit_request) { create(:kit_request, user: regular_user, kit: kit) }
      it "denies access" do
        sign_in regular_user
        delete api_v1_kit_request_path(kit_request), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
