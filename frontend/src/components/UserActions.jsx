import React from 'react';
import { Link } from 'react-router-dom';

const UserActions = () => (
  <div className='d-flex flex-column align-items-center mt-5'>
    <Link to="/donation" className="btn btn-primary btn-small mb-2">Make Donations</Link>
    <Link to="/kits" className='btn btn-primary btn-small mb-2'>Order Kits</Link>
    <Link to="/speaker" className='btn btn-primary btn-small'>Request Speakers</Link>
  </div>
);

export default UserActions;