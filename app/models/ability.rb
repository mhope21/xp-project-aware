class Ability
  # Defines the abilities that users have
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # Guest user (not logged in)

    if user.role == "admin"
      can :manage, :all # Admins can manage everything
    elsif user.role == "teacher"
      can :read, Booking, order: { user_id: user.id }
      can :create, Booking
      can :update, Booking, order: { user_id: user.id }
      can :read, Event
      can :read, Availability
      can :read, Order, user_id: user.id
      can :create, Order # Users can create new kit requests
      can [ :update ], Order, user_id: user.id # Users can update their own kit requests
    elsif user.role == "speaker"
      can :read, Booking, event: { speaker_id: user.id }
      can :manage, Event, speaker_id: user.id
      can :update, Booking, event: { speaker_id: user.id }
      can :manage, Availability, speaker_id: user.id
    else
      can :update, User, id: user.id
      can :profile, User, id: user.id
      can :read, Kit
      can :read, KitItem
      can :create, Donation
      can :read, Donation, user_id: user.id
      cannot :update, Donation
      can :create, Contact

    end
  end
end
