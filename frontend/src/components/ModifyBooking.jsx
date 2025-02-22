import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal } from 'react-bootstrap';
import moment from 'moment-timezone';


const ModifyBooking = ({ booking, userRole, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startTime, setStartTime] = useState(new Date(booking.start_time));
  const [endTime, setEndTime] = useState(new Date(booking.end_time));
  const [status, setStatus] = useState(booking?.status || booking?.data?.attributes?.status);
  const [availabilityId, setAvailabilityId] = useState(booking?.availability_id)
 
  const jwt = localStorage.getItem('jwt')
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (booking) {
        setStartTime(new Date(booking.start_time || booking.data.attributes.start_time));
        setEndTime(new Date(booking.end_time || booking.data.attributes.end_time));
    }
  }, [booking]);

  const convertUTCToCST = (utcDate) => {
    return moment(utcDate).tz('America/Chicago');
 };

 const handleClose = () => {
    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleUpdate = async () => {
    const params = {
        start_time: convertUTCToCST(startTime.toISOString()),
        end_time: convertUTCToCST(endTime.toISOString()),
        status: status,
      };
    
      console.log("Updating Booking - ID:", booking.id);
      console.log("Update Params:", params);
    try {
      const response = await fetch(`${API_URL}/bookings/${booking.product_id}`, {
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
    console.log("API Response:", data);
    onUpdate({ ...data.data.attributes, id: data.data.attributes.product_id });
    setIsEditing(false);
    setErrorMessage('');
    alert("Your booking has been updated.");
    window.location.reload();
    } catch (error) {
        setErrorMessage(error.message)
      console.error('Error updating booking:', error.message);
    }
  };

  function capitalizeFirstLetter(string) {
    if (!string) return ""; // Handle cases where the string might be null or undefined
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  return (
    <div><div>
         <div className='btn btn-primary btn-small' onClick={() => setIsEditing(true)}>Modify Booking</div>
        
    </div>
    <Modal show={isEditing} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Modify Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
            {errorMessage && <p style={{ color: 'red'}}>{errorMessage}</p>}
            </div>
            <div>
            <p><strong>Booking status:</strong> {capitalizeFirstLetter(booking?.status)}</p>
            <p><strong>Booking availability window:</strong><br></br> {moment(booking?.availability_start).format("MM/DD/YYYY, h:mm A")} - {moment(booking?.availability_end).format("MM/DD/YYYY, h:mm A")}</p>
            </div>
            <form>
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
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="denied">Denied</option>
              </select>
            </label>
          )}
          </div>
          </form>
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
