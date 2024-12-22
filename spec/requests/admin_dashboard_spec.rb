require 'rails_helper'

RSpec.describe "AdminDashboards", type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:user) { create(:user) }

  describe "GET /index" do
    context "when user role is admin" do
      it "returns http success" do
        sign_in admin_user
        get api_v1_admin_dashboard_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
    context "when user role is not admin" do
      it "returns http unauthorized" do
        sign_in user
        get api_v1_admin_dashboard_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
