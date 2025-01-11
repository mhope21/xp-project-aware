import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const UserActions = ({ profile }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    addresses: profile.addresses.map(address => ({
      street_address: address.street_address || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || ''
    })),
    organization_name: profile.organization.name || '',
    organization_address: {
      street_address: profile.organization.address?.street_address || '',
      city: profile.organization.address?.city || '',
      state: profile.organization.address?.state || '',
      postal_code: profile.organization.address?.postal_code || ''
    },
    bio: profile.bio || '',
    profile_image_url: profile.profile_image_url || ''
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    setFormData({ ...formData, profile_image_url: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated user details:', formData);
    handleClose();
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
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            {formData.addresses.map((address, index) => (
              <div key={index}>
                <Form.Group controlId={`formStreetAddress${index}`}>
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="street_address"
                    value={address.street_address}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
                <Form.Group controlId={`formCity${index}`}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
                <Form.Group controlId={`formState${index}`}>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={(e) => handleAddressChange(index, e)}
                  />
                </Form.Group>
                <Form.Group controlId={`formPostalCode${index}`}>
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
            <Form.Group controlId="formOrganizationName">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                name="organization_name"
                value={formData.organization_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formOrganizationStreetAddress">
              <Form.Label>Organization Street Address</Form.Label>
              <Form.Control
                type="text"
                name="street_address"
                value={formData.organization_address.street_address}
                onChange={(e) => setFormData({ ...formData, organization_address: { ...formData.organization_address, street_address: e.target.value } })}
              />
            </Form.Group>
            <Form.Group controlId="formOrganizationCity">
              <Form.Label>Organization City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.organization_address.city}
                onChange={(e) => setFormData({ ...formData, organization_address: { ...formData.organization_address, city: e.target.value } })}
              />
            </Form.Group>
            <Form.Group controlId="formOrganizationState">
              <Form.Label>Organization State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={formData.organization_address.state}
                onChange={(e) => setFormData({ ...formData, organization_address: { ...formData.organization_address, state: e.target.value } })}
              />
            </Form.Group>
            <Form.Group controlId="formOrganizationPostalCode">
              <Form.Label>Organization Postal Code</Form.Label>
              <Form.Control
                type="text"
                name="postal_code"
                value={formData.organization_address.postal_code}
                onChange={(e) => setFormData({ ...formData, organization_address: { ...formData.organization_address, postal_code: e.target.value } })}
              />
            </Form.Group>
            <Form.Group controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formProfileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="profile_image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserActions;