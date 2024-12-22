require 'rails_helper'

RSpec.describe "Admin::Users", type: :request do
  let(:admin) { create(:user, :admin) }
  let(:user) { create(:user) }

  describe "PATCH update_role" do
    context "when user role is admin" do
      it "allows admin to update user role" do
        sign_in admin
        patch admin_user_path(user), params: { user: { role: "admin" } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:ok)
        expect(user.reload.role).to eq("admin")
      end
    end

    context "when user role is not admin" do
      it "does not allow regular user to update role" do
        sign_in user
        patch admin_user_path(user), params: { user: { role: "admin" } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
        expect(user.reload.role).not_to eq("admin")
      end
    end
  end
end
