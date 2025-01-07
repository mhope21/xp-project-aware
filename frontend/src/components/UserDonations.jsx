import React from 'react';

const UserDonations = ({ profile }) => (
  <div>
    {profile.donations && profile.donations.length > 0 ? (
          <ul>
            {profile.donations.map((donation, index) => (
              <li key={index}>
                <p><strong>Date:</strong> {new Date(donation.created_at).toLocaleDateString()}</p>
                <p><strong>Amount:</strong> ${donation.amount}</p>                
              </li>
            ))}
          </ul>
        ) : (
          <p>No donations yet.</p>
        )}
  </div>
);

export default UserDonations;