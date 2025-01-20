import React, { useState, useContext } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AuthContext } from './auth/AuthContext';
import { API_URL } from '../constants';




const UserActions = ({ profile }) => {
  const { user } = useContext(AuthContext);
  const userId = user.id;
  const jwt = localStorage.getItem('jwt');
  const [show, setShow] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || "",
    email: profile?.email || '',
    addresses: profile?.addresses?.map(address => ({
      address_id: address?.address_id,
      street_address: address?.street_address || '',
      city: address?.city || '',
      state: address?.state || '',
      postal_code: address?.postal_code || ''
    })),
    organization_id: user?.organization_id || "",
    organization_name: profile?.organization.name || '',
    org_type: profile?.organization?.org_type || "",
    organization_address: {
      address_id: profile?.organization?.address_id || "",
      street_address: profile?.organization?.addresses?.street_address || '',
      city: profile?.organization?.addresses?.city || '',
      state: profile?.organization?.addresses?.state || '',
      postal_code: profile?.organization?.addresses?.postal_code || ''
    },
    bio: profile?.bio || '',
    profile_image_url: profile?.profile_image_url || ''
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleNewAddressForm = () => {
    setShowNewAddressForm(!showNewAddressForm);
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = formData.addresses.map((address, i) => 
      i === index ? { ...address, [name]: value } : address
    );
    setFormData({ ...formData, addresses: updatedAddresses });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_image_url: URL.createObjectURL(file),
      });
    }
  };
  
  
  const handleSubmitUser = async (e) => {
    e.preventDefault();
  
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      bio: formData.bio,
    };
  
    // Add file if selected
    const fileInput = document.querySelector('input[name="profile_image"]');
    const file = fileInput?.files[0];
    if (file) {
      payload.profile_image = file;
    }
  
    // Send the request
    await updateUser(userId, payload, jwt);
  };
  

  const updateUser = async (userId, userData, jwt) => {
    const userUrl = `${API_URL}/users/${userId}`;
    
    // Check if a profile image is included
    const isFormData = userData.profile_image !== undefined;
  
    const headers = {
      "Authorization": `Bearer ${jwt}`,
    };
  
    try {
      let response;
  
      if (isFormData) {
        // Handle the request when sending an image
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
          formData.append(`user[${key}]`, userData[key]);
        });
  
        response = await fetch(userUrl, {
          method: "PUT",
          headers,
          body: formData,
        });
      } else {
        // Handle the request without an image
        response = await fetch(userUrl, {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("User updated successfully!", result);
        alert("User details have been updated successfully.")
        window.location.reload();
      } else {
        console.error("Error updating user:", result.errors);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Loop through all addresses and update those that have an address_id
      for (const address of formData.addresses) {
        if (address.address_id) {

          const payload = {
            addressable_id: user.id,
            addressable_type: "User",
            street_address: address.street_address,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
          };
  

          const response = await fetch(`${API_URL}/users/${user.id}/addresses/${address.address_id}`, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
  
          if (response.ok) {
            console.log(`Address ${address.address_id} updated successfully.`);
          } else {
            const errorData = await response.json();
            console.error(`Error updating address ${address.address_id}:`, errorData.errors);
          }
        }
      }
  
      // Reload the page after all updates are complete
      alert("Addresses updated successfully.");
      window.location.reload();
      
    } catch (error) {
      console.error("Network error while updating addresses:", error);
    }
  };
  
  
  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
  
    const newAddress = {
      street_address: formData.street_address || "",
      city: formData.city || "",
      state: formData.state || "",
      postal_code: formData.postal_code || "",
    };
  
    const payload = {
      addressable_id: user.id,
      addressable_type: "User",
      ...newAddress,
    };
  
    // Send the new address data to the backend via POST request
    try {
      const response = await fetch(`${API_URL}/users/${user.id}/addresses`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const newAddress = await response.json();
        console.log("New address added successfully", newAddress);
        alert("New address added successfully.");
        setFormData((prevData) => ({
          ...prevData,
          addresses: [...prevData.addresses, newAddress]
        }));
       
        setFormData((prevData) => ({
          ...prevData,
          street_address: '',
          city: '',
          state: '',
          postal_code: ''
        }));
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        console.error("Error adding new address:", errorData.errors);
        alert("Failed to add new address.");
      }
    } catch (error) {
      console.error("Network error while adding new address:", error);
    }
  };  

  const handleOrganizationSubmit = async (e) => {
    e.preventDefault();
  
    const organizationData = {
      name: formData.organization_name,
      org_type: formData.org_type,
    };
  
    try {
      let response;
  
      if (formData.organization_id) {
        // Update existing organization
        response = await fetch(`${API_URL}/organizations/${formData.organization_id}`, {
          method: 'PUT',
          headers: {
            "Authorization": `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(organizationData),
        });
      } else {
        // Create new organization
        response = await fetch(`${API_URL}/organizations/create_and_assign_to_user?user_id=${user.id}`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(organizationData),
        });
      }
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Organization saved:', data);
        alert(formData.organization_id ? "Your organization has been updated." : "You have successfully added an organization.");
        window.location.reload();
      } else {
        console.error('Error:', data);
        alert("There was an issue saving the organization. Please try again.");
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleOrganizationAddressSubmit = async (e) => {
    e.preventDefault();
  
    // Determine if it's a new address or updating an existing one
    const addressData = {
      street_address: formData.organization_address.street_address,
      city: formData.organization_address.city,
      state: formData.organization_address.state,
      postal_code: formData.organization_address.postal_code,
      addressable_id: profile?.organization_id,
      addressable_type: "Organization",
    };
    console.log (profile?.organization_id);
  
    const url = `${API_URL}/organizations/${profile?.organization_id}/addresses`;
    const method = formData.organization_address.address_id ? 'PUT' : 'POST'; // If address_id exists, it's an update, else it's a create
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save address');
      }
  
      const data = await response.json();
      console.log('Address successfully saved:', data);
  
      formData.street_address = data.street_address;
      formData.city = data.city;
      formData.state = data.state;
      formData.postal_code = data.postal_code;
  
      alert(formData.organization_address.address_id ? "Address updated successfully!" : "Address added successfully!");
  
      window.location.reload();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('An error occurred while saving the address');
    }
  };
  


  return (
    <div className='d-flex flex-column align-items-center mt-5'>
      <Button variant="primary" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='update-form'>
            <Form.Group className='mb-2' controlId="formName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className='mb-2' controlId="formName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className='mb-2' controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className='mb-2' controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className='mb-2' controlId="formProfileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="profile_image"
                onChange={handleFileChange}
              />
            </Form.Group>            
            <Button variant="primary" className='btn btn-primary btn-sm' onClick={handleSubmitUser}>
              Update User Details
            </Button>
           
            {formData.addresses?.map((address, index) => (
              <div className='mt-3' key={index}>
                <h5>Address {index + 1}</h5>
                <Form.Group className='mb-2' controlId={`formStreetAddress${index}`}>
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="street_address"
                    value={address.street_address}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
                <Form.Group className='mb-2' controlId={`formCity${index}`}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
                <Form.Group className='mb-2' controlId={`formState${index}`}>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
                <Form.Group className='mb-2' controlId={`formPostalCode${index}`}>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postal_code"
                    value={address.postal_code}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
              </div>
            ))}

              {/* Conditionally Render New Address Form */}
              {showNewAddressForm && (
                <div className="mt-3">
                  <h5>New Address</h5>
                  <Form.Group className='mb-2'>
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="street_address"
                      value={formData.street_address || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className='mb-2'>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className='mb-2'>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className='mb-2'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="postal_code"
                      value={formData.postal_code || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button variant="primary" className="btn btn-sm" onClick={handleNewAddressSubmit}>
                    Save Address
                  </Button>
                </div>
              )}

            <div className="mt-3">
            {
              user.addresses && user.addresses.length > 0 ? (
                <>
                  <Button variant="primary" className="me-3 btn btn-sm" onClick={(e) => handleAddressSubmit(e, index)}>
                    Update Address
                  </Button>
                  <Button variant="primary" className="btn btn-sm" onClick={toggleNewAddressForm}>
                    Add Address
                  </Button>
                </>
              ) : (
                <Button variant="primary" className="btn btn-sm" onClick={toggleNewAddressForm}>
                  Add Address
                </Button>
              )
            }
            </div>
            <Form.Group className="mt-3 mb-2" controlId="formOrganizationName">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className=" mb-2" controlId="formOrganizationType">
              <Form.Label>Organization Type</Form.Label>
              <Form.Control
                type="text"
                name="org_type"
                value={formData.org_type}
                onChange={handleChange}
              />
            </Form.Group>
            <Button className='mb-3'variant="primary" onClick={handleOrganizationSubmit}>
              Update Organization
            </Button>
            <Form.Group className='mb-2' controlId="formOrganizationStreetAddress">
              <Form.Label>Organization Street Address</Form.Label>
              <Form.Control
                type="text"
                name="street_address"
                value={formData.organization_address.street_address}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  organization_address: { 
                    ...formData.organization_address, 
                    street_address: e.target.value 
                  } 
                })}
              />
            </Form.Group>
            <Form.Group className='mb-2' controlId="formOrganizationCity">
              <Form.Label>Organization City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.organization_address.city}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  organization_address: { 
                    ...formData.organization_address, 
                    city: e.target.value 
                  } 
                })}
              />
            </Form.Group>
            <Form.Group className='mb-2' controlId="formOrganizationState">
              <Form.Label>Organization State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={formData.organization_address.state}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  organization_address: { 
                    ...formData.organization_address, 
                    state: e.target.value 
                  } 
                })}
              />
            </Form.Group>
            <Form.Group className='mb-2' controlId="formOrganizationPostalCode">
              <Form.Label>Organization Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="postal_code"
                value={formData.organization_address.postal_code}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  organization_address: { 
                    ...formData.organization_address, 
                    postal_code: e.target.value 
                  } 
                })}
              />
            </Form.Group>
            <Button className='mb-3'variant="primary" onClick={handleOrganizationAddressSubmit}>
              Update Organization Address
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserActions;

