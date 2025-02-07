import React, { useContext, useEffect, useState } from 'react';
import DashboardCard from './DashboardCard'; 
import { API_URL } from '../constants';
import { AuthContext } from './auth/AuthContext';

const DashCardSet = () => {
  const { logout } = useContext(AuthContext);
  const [userCount, setUserCount] = useState(0);
  const [bookingOrderCount, setBookingOrderCount] = useState(0);
  const [kitOrderCount, setKitOrderCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const dashUrl = `${API_URL}/admin_dashboard`

  useEffect(() => {
    // Fetches data for the dashboard cards
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(dashUrl,  {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`, 
              'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
          const data = await response.json();
          setUserCount(data.users_count);
          setBookingOrderCount(data.booking_orders_count);
          setKitOrderCount(data.kit_orders_count);
          setTotalDonations(parseFloat(data.total_donations));
        } else {
          console.error('Failed to fetch data:', response.statusText);
          logout();
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert("An error occurred.")
        logout();
      }
    };

    fetchDashboardData();
  }, [dashUrl, logout]);

  return (
    // Displays data using the dashboard card component
    <div className="row h-100">
      <div className="col-md-3 mb-3">
        <DashboardCard title="Total # of Registered Users" value={userCount} color="rgb(248, 102, 224)" />
      </div>
      <div className="col-md-3 mb-3">
        <DashboardCard title="Total # of Booking Orders" value={bookingOrderCount} color="#0dcaf0" />
      </div>
      <div className="col-md-3 mb-3">
        <DashboardCard title="Total # of Kit Orders" value={kitOrderCount} color="rgb(252, 174, 86)" />
      </div>
      <div className="col-md-3 mb-3">
        <DashboardCard title="Total Donations" value={`$${totalDonations.toFixed(2)}`} color="rgb(98, 231, 98)" />
      </div>
    </div>
  );
};

export default DashCardSet;
