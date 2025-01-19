import React, { useContext } from 'react';
import default_user_img from '/assets/img/default_user_img.png'
import { Button } from 'react-bootstrap';
import { API_URL2 } from '../constants';
import { AuthContext } from './auth/AuthContext';



const UserDetails = ({ profile }) => {

  const jwt = localStorage.getItem("jwt");
  const { user } = useContext(AuthContext);

  const handlePasswordReset = async () => {
      
    try {
      const response = await fetch(`${API_URL2}/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({ user: { email: profile.email } }),
      });
  
      if (response.ok) {
        alert('Password reset email sent successfully.');
      } else {
        alert('Error sending password reset email.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending password reset email.');
    }
  };


  return (
  <div>
    
    <div className='team-member'>
            <img
                className='profile-image'
                src={profile.profile_image_url || default_user_img}
                alt="Profile Image"
              />
    <div className='text-start m-2'>
    <p className='mt-3'><strong>Name:</strong> {profile.name || 'No name provided'}</p>
   
    <p><strong>Email:</strong> {profile.email || 'No email provided'}</p>
    <p><strong>Address:</strong></p>
      {profile.addresses && profile.addresses.length > 0 ? (
        profile.addresses.map((address, index) => (
          <div key={index}>
            {`${address.street_address}, ${address.city}, ${address.state} ${address.postal_code}`}
          </div>
        ))
      ) : (
        <p>No address provided</p>
      )}
    <p><strong>Organization:</strong></p><p> {profile.organization.name || "No organization provided"}</p>
<p><strong>Organization Address:</strong></p> 
<p>
  {profile?.organization?.addresses?.length
    ? `${profile.organization.addresses[0]?.street_address}, ${profile.organization.addresses[0]?.city}, ${profile.organization.addresses[0]?.state} ${profile.organization.addresses[0]?.postal_code}`
    : "No organization address provided"}
</p>
    <p><strong>Bio:</strong> {profile.bio || "No bio provided"}</p>
    </div>
    </div>
    {profile.id === user.id && (
  <div className='d-flex flex-column align-items-center mt-5'>
    <Button className='btn btn-sm' variant="success" onClick={handlePasswordReset}>
      Send Password Reset
    </Button>
  </div>
)}
  </div>
  );
};

export default UserDetails;