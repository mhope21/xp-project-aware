class KitItem < ApplicationRecord
  has_and_belongs_to_many :kits, join_table: "kit_items_kits"
  has_one_attached :image

  validates :name, presence: true, uniqueness: true, length: { minimum: 5 }
  validates :description, presence: true, length: { minimum: 10 }
end
