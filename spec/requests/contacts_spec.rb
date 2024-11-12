require 'rails_helper'

RSpec.describe "Contacts", type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:regular_user) { create(:user, :regular_user) }
  let(:contact) { create(:contact) }

  describe "GET /index" do
    context "when user role is admin" do
      it "returns http success" do
        sign_in admin_user
        get api_v1_contacts_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
    context "when user role is not admin" do
      it "returns http response forbidden" do
        sign_in regular_user
        get api_v1_contacts_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "GET/ show" do
    context "when user role is admin" do
      it "returns http success" do
        sign_in admin_user
        get api_v1_contacts_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:success)
      end
    end
    context "when user role is not admin" do
      it "returns http response forbidden" do
        sign_in regular_user
        get api_v1_contacts_path, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "POST/ create" do
    it "allows creation without user authentication" do
      expect {
        post api_v1_contacts_path, params: { contact: { name: "Jane Eyre", email: "novelist@example.com", phone: "123-456-7890", message: "New book suggestions" } }
      }.to change(Contact, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe "PATCH/PUT update" do
    context "when user role is admin" do
      it "allows contact record to be updated" do
        sign_in admin_user
        patch api_v1_contact_path(contact), params: { contact: { message: "I have a new phone number." } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:ok)
        expect(contact.reload.message).to eq("I have a new phone number.")
      end
    end
    context "when user role is not admin" do
      it "does not allow contact to be updated" do
        sign_in regular_user
        patch api_v1_contact_path(contact), params: { contact: { message: "I have a new phone number." } }, headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
        expect(contact.reload.message).to_not eq("I have a new phone number.")
      end
    end
  end

  describe "DELETE /destroy" do
    context "when user is an admin" do
      it "deletes the kit request" do
        sign_in admin_user
        delete api_v1_contact_path(contact), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:ok)
        expect { contact.reload }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context "when user is not an admin" do
      it "denies access" do
        sign_in regular_user
        delete api_v1_contact_path(contact), headers: { 'Authorization': "Bearer #{@auth_token}" }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
