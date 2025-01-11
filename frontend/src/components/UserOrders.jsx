import React from 'react';
import { Link } from 'react-router-dom';

const UserOrders = ({ profile }) => (
  <div>
    {profile.orders && profile.orders.length > 0 ? (
        <table className='table table-striped' style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', marginRight: '10px' }}>Requested Kit</th>
              <th style={{ padding: '10px', marginRight: '10px' }}>Address</th>
              <th style={{ padding: '10px', marginRight: '10px' }}>School Year</th>
              <th style={{ padding: '10px', marginRight: '10px' }}>Phone</th>
              <th style={{ padding: '10px' }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {profile.orders.map((order, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', marginRight: '10px' }}>{order.ordered_product || 'Not specified'}</td>
                <td style={{ padding: '10px', marginRight: '10px' }}>{order.order_address || 'No address provided'}</td>
                <td style={{ padding: '10px', marginRight: '10px' }}>{order.school_year || 'No school year specified'}</td>
                <td style={{ padding: '10px', marginRight: '10px' }}>{order.phone || 'No phone number provided'}</td>
                <td style={{ padding: '10px' }}>{order.comments || 'No comments provided'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders yet.</p>
      )}
        <div className='d-flex flex-column align-items-center mt-5'>
            <Link to="/kits" className='btn btn-primary btn-small mb-2'>Order Kits</Link>
        </div>
  </div>
);

export default UserOrders;