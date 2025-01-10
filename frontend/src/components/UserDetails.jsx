import React from 'react';
import default_user_img from '/assets/img/default_user_img.png'

const UserDetails = ({ profile }) => (
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
 <p>{profile.organization?.address ? 
    `${profile.organization.address.street_address}, ${profile.organization.address.city}, ${profile.organization.address.state} ${profile.organization.address.postal_code}` 
    : "No organization address provided"}</p>
    <p><strong>Bio:</strong> {profile.bio || "No bio provided"}</p>
    </div>
    </div>
  </div>
);

export default UserDetails;