import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const UserBookings = ({ profile }) => (
  <div>
      {profile.bookings && profile.bookings.length > 0 ? (
        <table className='table table-striped' style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', marginRight: '20px' }}>Event</th>
              <th style={{ padding: '10px', marginRight: '20px' }}>Speaker</th>
              <th style={{ padding: '10px', marginRight: '20px' }}>Start Time</th>
              <th style={{ padding: '10px', marginRight: '20px' }}>End Time</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {profile.bookings.map((booking, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', marginRight: '20px' }}>{booking.event.title || 'No event name provided'}</td>
                <td style={{ padding: '10px', marginRight: '20px' }}>{booking.event.speaker || 'No speaker name provided'}</td>
                <td style={{ padding: '10px', marginRight: '20px' }}>{new Date(booking.start_time).toLocaleString()}</td>
                <td style={{ padding: '10px', marginRight: '20px' }}>{new Date(booking.end_time).toLocaleString()}</td>
                <td style={{ padding: '10px', color: booking.status === 'confirmed' ? 'green' : booking.status === 'declined' ? 'red' : 'black' }}>
                  {booking.status || 'No status provided'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings yet.</p>
      )}
    <div className='d-flex justify-content-center align-items-center gap-3 mt-5'>
        <Button className='btn btn-primary'>Modify Booking</Button>
        <Link to="/speaker" className='btn btn-primary btn-small'>Request Speakers</Link>
    </div>
  </div>
);

export default UserBookings;