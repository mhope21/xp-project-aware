import React from 'react';

const UserBookings = ({ profile }) => (
  <div>
    {profile.bookings && profile.bookings.length > 0 ? (
      <ul>
        {profile.bookings.map((booking, index) => (
          <li key={index}>
            <p><strong>Event:</strong> {booking.event_name || 'No event name provided'}</p>
            <p><strong>Speaker:</strong> {booking.speaker_name || 'No speaker name provided'}</p>
            <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
            <p
              style={{
                color: booking.status === 'confirmed' ? 'green' :
                       booking.status === 'declined' ? 'red' : 'black'
              }}
            >
              <strong>Status:</strong> {booking.status || 'No status provided'}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No bookings yet.</p>
    )}
  </div>
);

export default UserBookings;