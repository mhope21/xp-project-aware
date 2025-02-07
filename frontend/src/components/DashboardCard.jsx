import React from 'react';

// Reusable component for dashboard cards
const DashboardCard = ({ title, value, color }) => {
  return (
    <div
      className="card text-white h-100"
      style={{ backgroundColor: color }}
    >
      <div className="card-header">{title}</div>
      <div className="card-body">
        <h1 className="card-text display-4">{value}</h1>
      </div>
    </div>
  );
};

export default DashboardCard;
