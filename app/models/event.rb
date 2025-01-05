class Event < ApplicationRecord
  belongs_to :speaker, -> { where(role: "speaker") }, class_name: "User"
  has_many :bookings, dependent: :destroy
  has_many :orders, as: :product

  validates :title, presence: true
  validates :duration, presence: true
end
