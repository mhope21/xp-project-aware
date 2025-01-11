import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const Address = ({ onAddressSelect }) => {
  const [userAddresses, setUserAddresses] = useState([]);
  const [organizationAddress, setOrganizationAddress] = useState(null);
  const [error, setError] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    save_to_user: false,
  });

  const addressUrl = `${API_URL}/addresses`;
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(addressUrl, {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserAddresses(data.user_addresses);
        setOrganizationAddress(data.organization_address);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressChange = (event) => {
    const selectedAddressId = event.target.value;
    const selectedAddress = userAddresses.find(address => address.id === selectedAddressId) || organizationAddress;
    onAddressSelect(selectedAddress);
  };

  const handleNewAddressChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewAddress(prevAddress => ({
      ...prevAddress,
      [name]: type === 'checkbox' ? checked : value
    }));
    onAddressSelect({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const toggleUseNewAddress = () => {
    setUseNewAddress(!useNewAddress);
    if (!useNewAddress) {
      onAddressSelect(newAddress);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Select an Address</h2>
      <select onChange={handleAddressChange} disabled={useNewAddress}>
        {userAddresses.map(address => (
          <option key={address.id} value={address.id}>
            {address.street_address}, {address.city}, {address.state}, {address.postal_code}
          </option>
        ))}
        {organizationAddress && (
          <option key={organizationAddress.id} value={organizationAddress.id}>
            {organizationAddress.street_address}, {organizationAddress.city}, {organizationAddress.state}, {organizationAddress.postal_code} (Organization)
          </option>
        )}
      </select>
      <div>
        <label>
          <input
            type="checkbox"
            checked={useNewAddress}
            onChange={toggleUseNewAddress}
          />
          Use a new address
        </label>
      </div>
      {useNewAddress && (
        <div>
          <input
            type="text"
            name="street_address"
            value={newAddress.street_address}
            onChange={handleNewAddressChange}
            placeholder="Street Address"
          />
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleNewAddressChange}
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={newAddress.state}
            onChange={handleNewAddressChange}
            placeholder="State"
          />
          <input
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
      )}
    </div>
  );
};

export default Address;