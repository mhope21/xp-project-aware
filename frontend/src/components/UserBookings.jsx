import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ModifyBooking from './ModifyBooking';

const UserBookings = ({ profile }) => {
  const [bookings, setBookings] = useState(profile?.bookings);
  const [userRole, setUserRole] = useState(profile?.role);

  const handleUpdate = (updatedBooking) => {
    setBookings((prevBookings) =>
    prevBookings.map((booking) =>
    booking.id === updatedBooking.id ? updatedBooking : booking
  )
);
  };

  return (

  <div>
      {profile.bookings && profile.bookings.length > 0 ? (
        <table className='table table-striped' style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', marginRight: '20px' }}>Event</th>
              <th style={{ padding: '10px', marginRight: '20px' }}>Speaker</th>
              <th style={{ padding: '10px', marginRight: '20px' }}>Start Time</th>
              <th style={{ padding: '10px', marginRight: '20px' }}>End Time</th>
              <th style={{ padding: '10px', marginRight: '20px' }}>Status</th>
              <th style={{ padding: '10px'}}>Action</th>
            </tr>
          </thead>
          <tbody>
          {profile.bookings.map((booking, index) => (
  <tr key={index}>
    <td style={{ padding: '10px', marginRight: '20px' }}>
      {booking.event_name || 'No event name provided'}
    </td>
    <td style={{ padding: '10px', marginRight: '20px' }}>
      {booking.event_speaker ? `${booking.event_speaker.first_name} ${booking.event_speaker.last_name}` : 'No speaker name provided'}
    </td>
    <td style={{ padding: '10px', marginRight: '20px' }}>
      {new Date(booking.start_time).toLocaleString()}
    </td>
    <td style={{ padding: '10px', marginRight: '20px' }}>
      {new Date(booking.end_time).toLocaleString()}
    </td>
    <td style={{ padding: '10px', marginRight: '20px', color: booking.status === 'confirmed' ? 'green' : booking.status === 'declined' ? 'red' : 'blue' }}>
      {booking.status.toUpperCase() || 'No status provided'}
    </td>
    <td style={{ padding: '10px' }}>
    <ModifyBooking booking={booking} userRole={userRole} onUpdate={handleUpdate} />
    </td>
  </tr>
))}
          </tbody>
        </table>
      ) : (
        <p>No bookings yet.</p>
      )}
    <div className='d-flex justify-content-center align-items-center mt-5'> {profile?.role === 'teacher' ? ( <Link to="/speaker" className='btn btn-primary btn-small'>Book a Speaker</Link> ) : null} </div>
  </div>
);
};
export default UserBookings;