class ApplicationController < ActionController::API
  # When a user is not authorized for a resource, the HTTP response is forbidden
  rescue_from CanCan::AccessDenied do |exception|
    render json: { error: exception.message }, status: :forbidden
  end

  rescue_from ActionController::UnpermittedParameters do |exception|
    render json: { error: "Forbidden" }, status: :forbidden
  end
end
