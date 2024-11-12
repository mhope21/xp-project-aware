require 'rails_helper'

RSpec.describe "Donations", type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:regular_user) { create(:user, :regular_user) }
  let(:admin_donation) { create(:donation, user: admin_user, canceled: false) }
  let(:user_donation) { create(:donation, user: regular_user, canceled: false) }

  describe "GET /index" do
    context "when user role is admin" do
      it "returns http success" do
        sign_in admin_user
        get api_v1_donations_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
    context "when user role is not admin" do
      it "returns http response success" do
        sign_in regular_user
        get api_v1_donations_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET/ show" do
    context "when user role is admin" do
      it "returns http success" do
        sign_in admin_user
        get api_v1_donation_path(admin_donation), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
    context "when user role is not admin" do
      it "returns http response success" do
        sign_in regular_user
        get api_v1_donation_path(user_donation), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "POST/ create" do
    it "allows donation creation" do
      sign_in regular_user
      expect {
        post api_v1_donations_path, params: { donation: { amount: "50.0", payment_status: "successful", save_payment_info: false, payment_token: "0000999988886666" } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
      }.to change(Donation, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe "PATCH/PUT update" do
    context "when user role is admin" do
      let(:donation) { create(:donation, user: admin_user) }
      it "allows donation record to be updated" do
        sign_in admin_user
        patch api_v1_donation_path(donation), params: { donation: { payment_status: "successful" } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:ok)
        expect(donation.reload.payment_status).to eq("successful")
      end
    end
    context "when user role is not admin" do
      it "does not allow donation to be updated" do
        sign_in regular_user
        patch api_v1_donation_path(user_donation), params: { user_donation: { payment_status: "successful" } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
        expect(user_donation.reload.payment_status).to_not eq("successful")
      end
    end
  end

  describe "DELETE /destroy" do
    context "when user is an admin" do
      it "deletes the donation" do
        sign_in admin_user
        delete api_v1_donation_path(admin_donation), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:ok)
      end
    end

    context "when user is not an admin" do
      it "denies access" do
        sign_in regular_user
        delete api_v1_donation_path(user_donation), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
