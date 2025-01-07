import React from 'react';
import default_user_img from '/assets/img/default_user_img.png'

const UserDetails = ({ profile }) => (
  <div>
    <div className='d-flex flex-column align-items-center'>
    <img
        src={profile.profile_image_url || default_user_img}
        alt="Profile"
        style={{ width: '200px', height: '200px', borderRadius: '50%' }}
      />
    </div>
    <p><strong>Name:</strong> {profile.name || 'No name provided'}</p>
    <p><strong>Email:</strong> {profile.email || 'No email provided'}</p>
    <p><strong>Address:</strong>{profile.user_address || "No address provided"}</p>
    <p><strong>Organization:</strong> {profile.organization_name || "No organization provided"} </p>
    <p><strong>Organization Address:</strong> {profile.organization_address || "No organization address provided"} </p>
    <p><strong>Bio:</strong> {profile.bio || "No bio provided"}</p>
  </div>
);

export default UserDetails;