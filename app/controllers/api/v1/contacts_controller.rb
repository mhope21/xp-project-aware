class Api::V1::ContactsController < ApplicationController
  # Loads appropriate data and authorizes user access
  load_and_authorize_resource

  # GET api/v1/contacts
  def index
    @contacts = Contact.all
    render json: @contacts
  end

  # GET api/v1/contacts/1
  def show
    render json: @contact
  end

  # POST api/v1/contacts
  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      render json: { message: "Contact created successfully!" }, status: :created
    else
      render json: { errors: @contact.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT api/v1/contacts/1
  def update
    if @contact.update(contact_params)
      render json: { message: "Contact updated successfully!" }
    else
      render json: { errors: @contact.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE api/v1/contacts/1
  def destroy
    @contact.destroy
    render json: { message: "Contact deleted successfully!" }
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :phone, :message)
  end
end
