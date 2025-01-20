import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { API_URL } from '../constants';
import moment from 'moment-timezone';

const SpeakerBookings = ({ speakerBookings }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [status, setStatus] = useState('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const jwt = localStorage.getItem("jwt");


  const handleShowModal = (booking) => {
    setSelectedBooking(booking);
    console.log(booking);
    setStatus(booking.attributes.status);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async () => {
    if (selectedBooking && status) {
      try {
        const response = await fetch(`${API_URL}/bookings/${selectedBooking.attributes.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error('Failed to update booking status');
        }

        

        const updatedBookingData = await response.json();

        // Update the bookings list in the state (replace old data or modify the specific one)
        // setBookings((prevBookings) => 
        //   prevBookings.map(booking => 
        //     booking.id === updatedBookingData.attributes.id ? updatedBookingData : booking
        //   )
        // );

        // Update the booking in the table
        setSelectedBooking(updatedBookingData);
        handleHideModal(); // Close the modal after update
        setErrorMessage('');
        window.location.reload();
      } catch (error) {
        console.error('Error updating booking status:', error);
        setErrorMessage(error.error.message);
      }
    }
  };

  return (
    <div>
      <table className="table">
  <thead>
    <tr>
      <th>Booking Id</th>
      <th>Event Name</th>
      <th>Start Time</th>
      <th>End Time</th>
      <th>Status</th>
      <th>Modify Status</th>
    </tr>
  </thead>
  <tbody>
    {speakerBookings?.data?.length > 0 ? (
      speakerBookings.data.map((booking) => (
        <tr key={booking.id}>
          <td style={{ padding: '10px', marginRight: '20px' }}>
            {booking.attributes.id || 'No booking id provided'}
          </td>
          <td style={{ padding: '10px', marginRight: '20px' }}>
            {booking.attributes.event_name || 'No event name provided'}
          </td>
          <td style={{ padding: '10px', marginRight: '20px' }}>
            {moment(booking?.attributes?.start_time).format("MM/DD/YYYY, h:mm A")}
          </td>
          <td style={{ padding: '10px', marginRight: '20px' }}>
            {moment(booking.attributes.end_time).format("MM/DD/YYYY, h:mm A")}
          </td>
          <td style={{ padding: '10px', marginRight: '20px', color: booking.attributes.status === 'confirmed' ? 'green' : booking.attributes.status === 'denied' ? 'red' : 'blue' }}>
            {booking.attributes.status?.toUpperCase() || 'No status provided'}
          </td>
          <td>
            <div
              className="btn btn-primary btn-sm"
              onClick={() => handleShowModal(booking)}
            >
              Modify Status
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
          No bookings yet.
        </td>
      </tr>
    )}
  </tbody>
</table>


      {/* Modal for updating status */}
      {selectedBooking && (
        <Modal show={showModal} onHide={handleHideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modify Booking Status</Modal.Title>
            <div className='mt-3'>{errorMessage && `Error: ${errorMessage}`}</div>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedBooking.attributes.event_name}</h5>
            <p><strong>Booker:</strong> {selectedBooking.attributes.booking_name}</p>
            <p><strong>Location:</strong>
  {`${selectedBooking.attributes.booking_location[0]?.street_address}, ${selectedBooking.attributes.booking_location[0]?.city}, ${selectedBooking.attributes.booking_location[0]?.state} ${selectedBooking.attributes.booking_location[0]?.postal_code}`}</p>
            <p><strong>Time:</strong> {moment(selectedBooking.attributes.start_time).format("MM/DD/YYYY, h:mm A")} - {moment(selectedBooking.attributes.end_time).format("MM/DD/YYYY, h:mm A")}</p>
            <p><strong>Current Status:</strong> {selectedBooking.attributes.status}</p>
            <form>
            <div>
            <label>
              Status:
              <select
                className='form-control'
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="denied">Denied</option>
              </select>
            </label>
            </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className='btn-group'>
            <div className="btn btn-info btn-small" onClick={handleUpdateStatus}>
              Save
            </div>
            <div className="btn btn-primary btn-small" onClick={handleHideModal}>
              Cancel
            </div>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default SpeakerBookings;
