class OrderSerializer < ActiveModel::Serializer
  # Defines how to display the Order model
  attributes :id, :order_name, :order_email, :ordered_product, :order_address, :product_type, :product_id, :user_id, :address_id, :school_year, :comments, :phone, :created_at, :event_name, :event_speaker, :start_time, :end_time, :status, :availability_start, :availability_end

  def order_name
    object.user.name if object.user.present?
  end

  def ordered_product
    product = object.product

    return unless product.present?

    if product.is_a?(Kit)
      product.name
    elsif product.is_a?(Booking)
      product.event.title
    else
      "Unknown product type"
    end
  end

  def order_email
    object.user.email if object.user.present?
  end

  def order_address
    address = object.address
    if address.present?
      "#{address.street_address}, #{address.city}, #{address.state}, #{address.postal_code}"
    end
  end

  def event_name
    if object.product.is_a?(Booking)
      event = object.product.event
      puts "Event: #{event.inspect}"
      event.title if event.present?
    end
    puts "Product class: #{object.product.class.name}"
    puts "Product: #{object.product.inspect}" if object.product.is_a?(Booking)
    object.product.event.title if object.product.is_a?(Booking)
  end

  def event_speaker
    object.product.event.speaker if object.product.is_a?(Booking)
  end

  def start_time
    object.product.start_time if object.product.is_a?(Booking)
  end

  def end_time
    object.product.end_time if object.product.is_a?(Booking)
  end

  def status
    object.product.status if object.product.is_a?(Booking)
  end

  def availability_start
    object.product.availability.start_time if object.product.is_a?(Booking)
  end

  def availability_end
    object.product.availability.end_time if object.product.is_a?(Booking)
  end
end
