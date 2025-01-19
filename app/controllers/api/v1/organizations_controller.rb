class Api::V1::OrganizationsController < ApplicationController
  before_action :set_organization, only: [ :show, :update, :destroy ]
  before_action :set_user, only: [ :create_and_assign_to_user ]

  # POST /organizations
  def create
    @organization = Organization.new(organization_params)

    if @organization.save
      render json: @organization, status: :created
    else
      render json: @organization.errors, status: :unprocessable_entity
    end
  end

  # PUT /organizations/:id
  def update
    if @organization.update(organization_params)
      render json: @organization, status: :ok
    else
      render json: @organization.errors, status: :unprocessable_entity
    end
  end

  # GET /organizations/:id
  def show
    render json: @organization
  end

  # DELETE /organizations/:id
  def destroy
    @organization.destroy
    head :no_content
  end

  def create_and_assign_to_user
    ActiveRecord::Base.transaction do
      # Create the organization
      @organization = Organization.create!(organization_params)

      # Update the user with the organization_id
      @user.update!(organization_id: @organization.id)

      render json: { organization: @organization, user: @user }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_organization
    @organization = Organization.find(params[:id])
  end

  def organization_params
    params.require(:organization).permit(:name, :org_type)
  end
end
