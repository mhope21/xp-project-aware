import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal } from 'react-bootstrap';


const timeZone = 'America/Chicago';

const ModifyBooking = ({ booking, userRole, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState(new Date(booking.start_time));
  const [endTime, setEndTime] = useState(new Date(booking.end_time));
  const [status, setStatus] = useState(booking.status);
  const [availabilityWindow, setAvailabilityWindow] = useState(booking.availability_window);
  const jwt = localStorage.getItem('jwt')
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (booking) {
        setStartTime(new Date(booking.start_time));
        setEndTime(new Date(booking.end_time));
        setStatus(booking.status);
        setAvailabilityWindow(booking.availability_window);
    }
  }, [booking]);

  const handleUpdate = async () => {
    const params = { start_time: startTime.toISOString(), end_time: endTime.toISOString(), status };
    try {
      const response = await fetch(`${API_URL}/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      onUpdate(data);
      setIsEditing(false);
      setErrorMessage('');
    } catch (error) {
        setErrorMessage(error.message)
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div><div>
         <div className='btn btn-primary btn-small' onClick={() => setIsEditing(true)}>Modify Booking</div>
        
    </div>
    <Modal show={isEditing} onHide={() => setIsEditing(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Modify Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
            {errorMessage && <p style={{ color: 'red'}}>{errorMessage}</p>}
            </div>
            <div>
            <p>Availability Start Time: {new Date(availabilityWindow.start_time).toLocaleString()}</p>
            <p>Availability End Time: {new Date(availabilityWindow.end_time).toLocaleString()}</p>
            </div>
            <div>
          {userRole === 'teacher' && (
            <>
              <label>
                Start Time:
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  timeIntervals={15}
                />
              </label>
              <label>
                End Time:
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  timeIntervals={15}
                />
              </label>
            </>
          )}
          {userRole === 'speaker' && (
            <label>
              Status:
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
              </select>
            </label>
          )}
          </div>
          </Modal.Body>
          <Modal.Footer>
          <div className='btn-group'>
          <div className='btn btn-info btn-small' onClick={handleUpdate}>Save</div>
          <div className='btn btn-primary btn-small' onClick={() => setIsEditing(false)}>Cancel</div>
          </div>
          </Modal.Footer>
          </Modal>
        </div>
  );
};

export default ModifyBooking;
