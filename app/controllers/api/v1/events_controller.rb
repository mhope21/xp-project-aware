class Api::V1::EventsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_event, only: [ :show, :update, :destroy ]

  def index
    # Check if speaker_id is passed in query parameters
    if params[:speaker_id]
      # Find events that belong to the speaker with the specified speaker_id
      @events = Event.where(speaker_id: params[:speaker_id])
    else
      # If no speaker_id is provided, return all events
      @events = Event.all
    end
    render json: @events
  end

  def show
    render json: @event
  end

  def create
    @event = Event.new(event_params)
    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def update
    if @event.update(event_params)
      render json: @event
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @event.destroy
    head :no_content
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end

  def event_params
    params.require(:event).permit(:speaker_id, :title, :description, :duration)
  end
end
