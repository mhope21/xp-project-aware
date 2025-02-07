class Admin::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin
  load_and_authorize_resource
  before_action :set_user, only: [ :update ]

  def index
    @users = User.all

    # Map over the users to extract the necessary fields
    users_data = @users.map do |user|
      {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        created_at: user.created_at
      }
    end

    render json: { data: users_data }
  end

  # PATCH admin/users/:id
  def update
    if @user.update(admin_user_params)
      render json: { message: "User updated successfully!" }
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def authorize_admin
    render json: { error: "You are not authorized to perform this action" }, status: :forbidden unless current_user.role == "admin"
  end

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :profile_image)
  end

  def admin_user_params
      params.require(:user).permit(:first_name, :last_name, :email, :role)
  end
end
