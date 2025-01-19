class Api::V1::UsersController < ApplicationController
before_action :set_user, only: [ :update, :show ]
load_and_authorize_resource


  # GET /api/v1/users
  def index
    @users = User.all
    render json: UserSerializer.new(@users).serializable_hash.to_json
  end

  # GET /api/v1/users/1
  def show
    render json: @users
  end

  # PATCH/PUT api/v1/users/1
  def update
    begin
      # Handle profile_image if provided
      if user_params[:profile_image].present?
        @user.profile_image.attach(user_params[:profile_image])
      end

      # Update other user attributes
      if @user.update(user_params.except(:profile_image))
        render json: { message: "User updated successfully!" }
      else
        render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
      end

    rescue ActionController::ParameterMissing => e
      render json: { error: e.message }, status: :bad_request
    end
  end

  # DELETE api/v1/users/:id
  def destroy
    @user.destroy
    render json: { message: "User deleted successfully!" }
  end

  def profile
    role = current_user.role
    render json: UserProfileSerializer.new(@user, { params: { role: role } }).serializable_hash
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :bio, :profile_image, :organization_id)
  end
end
