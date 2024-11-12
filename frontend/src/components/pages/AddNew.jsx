import React, { useEffect } from 'react';

const AddNew = ({ header, children }) => {
  // Helps page to load to top of screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    // Dynamic form for adding a new user, kit, kit_item
    <div>
        <section className="page-section" id="register">
        <div className="container d-flex justify-content-center mt-3" >
    <div className="card" style={{
            boxShadow: '25px 25px 55px rgba(0, 0, 0, 0.5)', 
            borderTop: '1.5px solid rgba(255, 255, 255, 0.5)',
            borderLeft: '1.5px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)'
            }}>
      <div className="card-header">
        <h3>{header}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
    </div>
    </section>
    </div>
  );
};

export default AddNew;
