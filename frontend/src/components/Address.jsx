import React, { useState, useEffect } from 'react';

const Address = ({ user, onAddressSelect, handleNewAddressSave }) => {
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    save_to_user: false,
  });

  const handleAddressChange = (event) => {
    const selectedAddressId = parseInt(event.target.value, 10);
    const selectedAddress = user?.addresses?.find((address) => address.id === selectedAddressId) || user?.organization?.addresses?.find((address) => address.id === selectedAddressId);
    if (selectedAddress) {
    onAddressSelect(selectedAddress);
    }
  };

  const handleNewAddressChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    // Update the state based on the input change (checkbox or text)
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: type === 'checkbox' ? checked : value,
    }));
  
    // If the checkbox for "save_to_user" is checked, save the address
    if (name === "save_to_user" && checked) {
      handleSaveAddress(); // Only save if checked
    }
  };
  
  // Use effect to log the state after it's updated
  useEffect(() => {
    console.log("New address state after change:", newAddress);
  }, [newAddress]);  // This will log every time the state changes
  

  const handleSaveAddress = () => {
    handleNewAddressSave(newAddress);
  }

  const toggleUseNewAddress = () => {
    setUseNewAddress(!useNewAddress);
    if (!useNewAddress) {
      onAddressSelect(newAddress);
    } else {
      onAddressSelect(null); // Clear the selected address when toggling back
    }
  };

  if (!user || !user.addresses) {
    return <p>Loading...</p>;
  }

  return (
    <div>
       
      <label>Select an Address</label>
      <select className="select-container mt-3" onChange={handleAddressChange} disabled={useNewAddress}>
        <option value="">Select an address</option>
        {user.addresses?.map(address => (
          <option key={address.id} value={address.id}>
            {address.street_address}, {address.city}, {address.state}, {address.postal_code}
          </option>
        ))}
        {user.organization?.addresses?.length > 0 && (
  <option
    key={user.organization?.addresses[0]?.id}
    value={user.organization?.addresses[0]?.id}
  >
    {user.organization?.addresses[0]?.street_address}, 
    {user.organization?.addresses[0]?.city}, 
    {user.organization?.addresses[0]?.state}, 
    {user.organization?.addresses[0]?.postal_code} 
    (Organization)
  </option>
)}
      </select>
      <div>
        <label>
          <input
            type="checkbox"
            checked={useNewAddress}
            onChange={toggleUseNewAddress}
            className='mt-3'
          />
          Use a new address
        </label>
      </div>
      {useNewAddress && (
        <div>
            
            <div className='form-group mb-3'>
          <input
            className='form-control shadow mb-3'
            type="text"
            name="street_address"
            value={newAddress.street_address}
            onChange={handleNewAddressChange}
            placeholder="Street Address"
          />
          <input
            className='form-control shadow mb-3'
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleNewAddressChange}
            placeholder="City"
          />
          <input
            className='form-control shadow mb-3'
            type="text"
            name="state"
            value={newAddress.state}
            onChange={handleNewAddressChange}
            placeholder="State"
          />
          <input
            className='form-control shadow mb-3'
            type="text"
            name="postal_code"
            value={newAddress.postal_code}
            onChange={handleNewAddressChange}
            placeholder="Postal Code"
          />
          <label>
            <input
              type="checkbox"
              name="save_to_user"
              checked={newAddress.save_to_user}
              onChange={handleNewAddressChange}
            />
            Save to User
          </label>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Address;