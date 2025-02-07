import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { API_URL2, API_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

const EditModal = ({ record, show, handleClose, handleDelete, recordType, setData }) => {
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate();
  

  // Set initial form data when the modal opens
  useEffect(() => {
    setFormData(record || {}); // Populate formData with the selected record
  }, [record]);

  // Handle form field changes
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    console.log("Image added to record")
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    
    const updatedFormData = new FormData();
    let api;
   // Record type determines which data to display in the edit modal and api determines which api endpoint to send the data to 
    if (recordType === 'kit') {
        updatedFormData.append('kit[name]', formData.name);
        updatedFormData.append('kit[description]', formData.description);
        updatedFormData.append('kit[grade_level]', formData.grade_level);
        api = "kits";
    } else if (recordType === 'kitItem') {
        updatedFormData.append('kit_item[name]', formData.name);
        updatedFormData.append('kit_item[description]', formData.description); 
        api = "kit_items_only";      
    } else if (recordType === 'order') {
        updatedFormData.append('order[phone]', formData.phone);
        updatedFormData.append('order[school_year]', formData.school_year);
        updatedFormData.append('order[product_id]', formData.product_id);
        updatedFormData.append('order[product_type]', formData.product_type);
        updatedFormData.append('order[order_address]', formData.order_address);
        updatedFormData.append('order[comments]', formData.comments);
        updatedFormData.append('order[user_id]', formData.user_id);
        api = "orders";
    } else if (recordType === 'donation') {
        updatedFormData.append('donation[amount]', formData.amount);
        updatedFormData.append('donation[user_id]', formData.user_id);
        api = "donations";
    } else if (recordType === 'contact') {
        updatedFormData.append('contact[user_id]', formData.user_id);
        // added first name and last name
        updatedFormData.append('contact[first_name]', formData.first_name);
        updatedFormData.append('contact[last_name]', formData.last_name);
        updatedFormData.append('contact[email]', formData.email);
        updatedFormData.append('contact[phone]', formData.phone);
        updatedFormData.append('contact[message]', formData.message);
        api = "contacts";       
    } else if (recordType === 'user') {
      // Add first name and last name
      updatedFormData.append('user[first_name]', formData.first_name);  
      updatedFormData.append('user[last_name]', formData.last_name);
      updatedFormData.append('user[email]', formData.email);
      updatedFormData.append('user[role]', formData.role);
    }
    
    // Add the image if selected
if (selectedImage) {
  if (recordType === 'kit') {
    updatedFormData.append('kit[image]', selectedImage);
    console.log('kit image appended');
  } else if (recordType === 'kitItem') {
    updatedFormData.append('kit_item[image]', selectedImage);
    console.log('kit_item image appended');
  }
}

    
let apiEndpoint;

if (recordType === 'user') {
  // If updating the user with role, use the admin endpoint
  apiEndpoint = `http://localhost:3000/admin/users/${formData.id}`;
} else {
  // Otherwise, use the standard update endpoint
  apiEndpoint = `${API_URL}/api/v1/users/${formData.id}`;
}
    console.log(apiEndpoint);
    console.log(updatedFormData);
    
    const result = await handleApiUpdate(apiEndpoint, updatedFormData);
    
    if (result.success) {
        console.log(`${recordType} updated successfully!`);
        alert(`${recordType} updated successfully!`);
        handleClose();
        setData((prevData) => {
          return prevData.map((item) =>
            item.id === formData.id ? { ...item, ...formData } : item
          )});
    } else {
      alert("An error occurred with the update.")
    }
    };

    // Utility function for making the API call
  const handleApiUpdate = async (apiEndpoint, updatedFormData) => {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${jwt}`, 
        },
        body: updatedFormData, 
      });
  
      if (response.ok) {
        const data = await response.json(); 
        console.log("Update successful:", data);
        return { success: true, data };
      } else {
        console.error('Error updating the record');
        return { success: false };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false };
    }
  };
  // Stretch Goal: Extend the functionality of the password reset
  // When admin is editing user, admin can send a password reset email, button on user edit modal
  const handlePasswordReset = async () => {
    
    try {
      const response = await fetch(`${API_URL2}/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({ user: { email: formData.email } }),
      });
  
      if (response.ok) {
        alert('Password reset email sent successfully.');
        navigate("/authenticated/admin");
      } else {
        alert('Error sending password reset email.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending password reset email.');
    }
  };
  
  
      // For delete button on Modal, allows a particular record to be deleted or canceled if donation

  const onDelete = () => {
    handleDelete(record.id); // Pass the record ID to the delete handler
    handleClose(); // Close the modal
  };

  return (
    // Displays appropriate modal for selected record type
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{`Edit ${recordType.charAt(0).toUpperCase() + recordType.slice(1)}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          {/* Added first and last name fields */}
        {recordType === 'user' && (
            <>
              <div className="mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={onChange}
                />
                </div>
                <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email || ''}
                  onChange={onChange}
                />
                </div>
              <div className="mb-3">
                <label>Role</label>
                <input 
                  type="text" 
                  name='role'
                  className="form-control"
                  value={formData.role || ''} 
                  onChange={onChange}
                  placeholder='user, teacher, or admin' 
                  
                />
              </div>
              
            </>
          )}
          {recordType === 'kit' && (
            <>
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description || ''}
                  onChange={onChange}
                  rows={5}
                />
              </div>
              <div className="mb-3">
                <label>Grade Level</label>
                <input 
                  type="text"
                  name='grade_level' 
                  className="form-control" 
                  onChange={onChange} 
                  placeholder='YYYY-YYYY'
                />
              </div>
              <div className="mb-3">
                <label>Update Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={handleImageChange} 
                />
              </div>
            </>
          )}

          {recordType === 'kitItem' && (
            <>
              <div className="mb-3">
                <label>Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>Item Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description || ''}
                  onChange={onChange}
                  rows={5}
                />
              </div>
              <div className="mb-3">
                <label>Update Item Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={handleImageChange} 
                />
              </div>
            </>
          )}
           {recordType === 'order' && (
            <>
              <div className="mb-3">
                <label>Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={onChange}
                  placeholder='123-456-7890'
                />
              </div>
              <div className="mb-3">
                <label>School Year</label>
                <input
                  className="form-control"
                  name="school_year"
                  value={formData.school_year || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>Product Type</label>
                <input
                  className="form-control"
                  name="product_type"
                  value={formData.product_type || ''}
                  onChange={onChange}
                  
                />
              </div>
              <div className="mb-3">
                <label>Order Address</label>
                <input
                  className="form-control"
                  name="school_address"
                  value={formData.order_address || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>Comments</label>
                <input
                  className="form-control"
                  name="comments"
                  value={formData.comments || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>User Id</label>
                <input
                  className="form-control"
                  name="user_id"
                  value={formData.user_id || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>Product Id</label>
                <input
                  className="form-control"
                  name="kit_id"
                  value={formData.product_id || ''}
                  onChange={onChange}
                />
              </div>
            </>
          )}
          {recordType === 'donation' && (
            <>
              <div className="mb-3">
                <label>Amount</label>
                <input
                  type="text"
                  className="form-control"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>User Id</label>
                <input
                  className="form-control"
                  name="user_id"
                  value={formData.user_id || ''}
                  onChange={onChange}
                />
              </div>
             
            </>
          )}
          {recordType === 'contact' && (
            <>
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>User Id</label>
                <input
                  className="form-control"
                  name="user_id"
                  value={formData.user_id || ''}
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input 
                  type="text" 
                  name='email'
                  className="form-control"
                  value={formData.email || ''} 
                  onChange={onChange} 
                  
                />
              </div>
              <div className="mb-3">
                <label>Phone</label>
                <input 
                  type="tel" 
                  name='phone'
                  className="form-control" 
                  value={formData.phone || ''}
                  onChange={onChange}
                  placeholder='123-456-7890' 
                />
              </div>
              <div className="mb-3">
                <label>Message</label>
                <textarea
                  className="form-control"
                  name="message"
                  value={formData.message || ''}
                  onChange={onChange}
                  rows={5}
                />
              </div>
            </>
          )}

        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Update
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
        {recordType === 'user' && (
          <Button variant="success" onClick={handlePasswordReset}>
            Send Password Reset
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;

