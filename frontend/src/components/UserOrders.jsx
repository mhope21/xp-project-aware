import React from 'react';

const UserOrders = ({ profile }) => (
  <div>
    {profile.orders && profile.orders.length > 0 ? (
          <ul>
            {profile.orders.map((order, index) => (
              <li key={index}>
                <p><strong>Requested Kit:</strong> {order.ordered_kit || 'Not specified'}</p>
                <p><strong>Address:</strong> {order.address || 'No address provided'}</p>
                <p><strong>School Year:</strong> {order.school_year || 'No school year specified'}</p>
                <p><strong>Phone:</strong> {order.phone || 'No phone number provided'}</p>
                <p><strong>Comments:</strong> {order.comments || 'No comments provided'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders yet.</p>
        )}
  </div>
);

export default UserOrders;