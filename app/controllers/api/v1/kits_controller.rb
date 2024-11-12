class Api::V1::KitsController < ApplicationController
  before_action :set_kit, only: %i[ show update destroy ]

  # GET /kits
  def index
    @kits = Kit.all

    render json: @kits
  end

  # GET /kits/1
  def show
    render json: @kit
  end

  # POST /kits
  def create
    @kit = Kit.new(kit_params)

    if @kit.save
      render json: @kit, status: :created, location: @kit
    else
      render json: @kit.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /kits/1
  def update
    if @kit.update(kit_params)
      render json: @kit
    else
      render json: @kit.errors, status: :unprocessable_entity
    end
  end

  # DELETE /kits/1
  def destroy
    @kit.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_kit
      @kit = Kit.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def kit_params
      params.require(:kit).permit(:name, :description, :grade_level, :image)
    end
end
