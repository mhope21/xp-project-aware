import React from 'react';
import { Outlet } from 'react-router-dom';

// Component for displaying forms for adding new records
const NewForms = () => {
    return (
      <div>
        
        <Outlet/>
      </div>

    );
};

export default NewForms;