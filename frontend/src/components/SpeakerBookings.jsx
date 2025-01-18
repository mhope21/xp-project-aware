import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { API_URL } from '../constants';

const SpeakerBookings = ({  }) => {
  const [speakerBookings, setSpeakerBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [status, setStatus] = useState('pending');
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchSpeakerBookings = async () => {
      if (profile && profile.speaker_bookings && profile.speaker_bookings.data) {
        setSpeakerBookings(profile.speaker_bookings.data);
      }
    };
    fetchSpeakerBookings();
  }, [profile]);

  const handleShowModal = (booking) => {
    setSelectedBooking(booking);
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

        // Update the booking in the table
        setSpeakerBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.attributes.id === updatedBookingData.id
              ? { ...booking, attributes: { ...booking.attributes, status: updatedBookingData.status } }
              : booking
          )
        );

        handleHideModal(); // Close the modal after update
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    }
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
            <th>Modify Status</th>
          </tr>
        </thead>
        <tbody>
          {speakerBookings.map((booking) => (
            <tr key={booking.attributes.id}>
              <td style={{ padding: '10px', marginRight: '20px' }}>
              {booking.attributes.event_name || 'No event name provided'}
            </td>
            <td style={{ padding: '10px', marginRight: '20px' }}>
              {convertUTCToCST(booking.attributes.start_time)}
            </td>
            <td style={{ padding: '10px', marginRight: '20px' }}>
              {convertUTCToCST(booking.attributes.end_time)}
            </td>
            <td style={{ padding: '10px', marginRight: '20px', color: booking.data.attributes.status === 'confirmed' ? 'green' : booking.data.attributes.status === 'declined' ? 'red' : 'blue' }}>
              {booking.attributes.status?.toUpperCase() || 'No status provided'}
            </td>
              <td>
                <div
                  className="btn btn-info btn-sm"
                  onClick={() => handleShowModal(booking)}
                >
                  Modify Status
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>

      {/* Modal for updating status */}
      {selectedBooking && (
        <Modal show={showModal} onHide={handleHideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modify Booking Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>{selectedBooking.attributes.event_name}</h5>
            <p>Status: {selectedBooking.attributes.status}</p>
            <label>
              Status:
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </label>
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
