require 'rails_helper'

RSpec.describe "CurrentUsers", type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:teacher) { create(:user, :teacher) }
  let(:user) { create(:user) }

  describe "GET /index" do
    context "when user is an admin" do
      it "returns http success" do
        sign_in admin_user
        get "/current_user", headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end

    context "when user is a teacher" do
      it "returns http success" do
        sign_in teacher
        get "/current_user", headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end

    context "when user is a regular user" do
      it "returns http success" do
        sign_in user
        get "/current_user", headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
  end
end
