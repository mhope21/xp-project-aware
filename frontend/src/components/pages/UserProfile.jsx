import React, { useEffect, useState } from 'react';
import { API_URL } from '../../constants';
import { Link, useParams } from 'react-router-dom';
import UserDetails from '../UserDetails';
import UserActions from '../UserActions';
import UserDonations from '../UserDonations';
import UserOrders from '../UserOrders';
import UserBookings from '../UserBookings';
import SpeakerCalendar from '../SpeakerCalendar';
import AvailabilityModal from '../AvailabilityModal';
import BookingModal from '../BookingModal';


const UserProfile = ({ user }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const jwt = localStorage.getItem("jwt")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${id}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfile(data.data.attributes);
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchProfile();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="black-strip"></div>
      <section className="page-section">
        <div className='text-center mt-3 mb-5'><h1>User Profile</h1></div>
      <div className='d-flex'>
        
      <div className='container fluid ms-4 me-1 w-25'>
        <div className='profile-card'><UserDetails profile={profile} />
      <div>
      <UserActions profile={profile} />
      </div>
      </div>
      </div>
      
        <div className='container ms-1 me-4'>
          {user?.role == "speaker" && (
            <div className='other-card mb-5'>
              <div className='other-card-header'>
                <h4>Speaker Calendar</h4>
              </div>
              <SpeakerCalendar user={user}/>
              <div><p>To create an availability, please click on a date.</p></div>
            </div>
          )}
          <div className='other-card mb-5'>
            <div className='other-card-header'><h4>Donations</h4></div>
            <UserDonations profile={profile} />
        </div>
        {user?.role === "teacher" && (
          <div className="other-card mb-5">
            <div className="other-card-header">
              <h4>Kit Orders</h4>
            </div>
            <UserOrders profile={profile} />
          </div>
        )}
        <div className='other-card mb-5'>
        <div className='other-card-header'><h4>Bookings</h4></div>
        <UserBookings profile={profile} />
        </div>
        </div>
        
      </div>
      </section>
    </>
  );
};

export default UserProfile;