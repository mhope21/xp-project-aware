import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { API_URL } from '../constants';

const AvailabilityModal = ({ speakerId, isOpen, onClose, selectedDate, setEvents, availability, setAvailabilities }) => {
  const [startTime, setStartTime] = useState(new Date(selectedDate));
  const [endTime, setEndTime] = useState(new Date(selectedDate));
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringEndDate, setRecurringEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (availability) {
      setStartTime(new Date(availability.start_time));
      setEndTime(new Date(availability.end_time));
      setIsRecurring(availability.is_recurring);
      setRecurringEndDate(availability.recurring_end_date ? new Date (availability.recurring_end_date) : null);
    } else {
      setStartTime(new Date(selectedDate));
      setEndTime(new Date(selectedDate));
    }
  }, [availability, selectedDate]);
  

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
        alert("Please select both start and end times.");
        return;
      }

      if (isRecurring && !recurringEndDate) {
        alert("Please select a recurring end date.");
        return;
      }

    const newAvailability = {
      availability: {
      speaker_id: speakerId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      is_recurring: isRecurring,
      recurring_end_date: isRecurring ? recurringEndDate.toISOString() : null,
      }
    };

    try {
      const response = await fetch(
        availability ? `${API_URL}/availabilities/${availability.id}` : `${API_URL}/availabilities`, {
        method: availability ? "PATCH" : "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAvailability),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Availability data: ", data)
        const newEvent = {
            id: data.id,
            start: data.start_time,
            end: data.end_time,
            title: "Speaker Availability"
          };
      
          setEvents((prevEvents) => {
            const existingEventIndex = prevEvents.findIndex((event) => event.id === data.id);
            if (existingEventIndex > -1) { // Edit existing event
              const updatedEvents = [...prevEvents];
              updatedEvents[existingEventIndex] = newEvent;
              return updatedEvents;
             }
              // Create new event
               return [...prevEvents, newEvent];
             });

             setAvailabilities((prevAvailabilities) => {
              const existingAvailabilityIndex = prevAvailabilities.findIndex((avail) => avail.id === data.id);
              if (existingAvailabilityIndex > -1) {
                const updatedAvailabilities = [...prevAvailabilities];
                updatedAvailabilities[existingAvailabilityIndex] = data;
                return updatedAvailabilities;
             } 
             return [...prevAvailabilities, data];
            });

          resetFormFields();
          onClose(); // Close the modal after creation
          alert("Your availability has been created.")
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error('Error creating availability:', error);
      setErrorMessage('An error occurred while creating availability.');
    }
  };

  const resetFormFields = () => {
    setIsRecurring(false);
    setRecurringEndDate(null);
    setErrorMessage("");
  };

  const onCloseHandler = () => {
    resetFormFields();
    onClose();
  }

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{availability ? 'Edit Availability' : 'Create New Availability' }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form>
          <Form.Group>
            <Form.Label>Start Time</Form.Label>
            <DatePicker
              selected={startTime} // Bind to startTime state
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat="Pp"
              timeIntervals={15} // Time intervals for the time picker
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>End Time</Form.Label>
            <DatePicker
              selected={endTime} // Bind to endTime state
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              dateFormat="Pp"
              timeIntervals={15}
            />
          </Form.Group>
      {!availability && (
        <>
          <Form.Group>
  <Form.Label>
    <Form.Check
      type="checkbox"
      label="Recurring Availability"
      checked={isRecurring}
      onChange={(e) => setIsRecurring(e.target.checked)}
    />
  </Form.Label>
</Form.Group>

{isRecurring && (
  <Form.Group>
    <Form.Label>Recurring End Date</Form.Label>
    <DatePicker
      selected={recurringEndDate}
      onChange={(date) => setRecurringEndDate(date)}
      dateFormat="yyyy-MM-dd"
      minDate={new Date()} // Prevent past dates
      placeholderText="Select end date"
      isClearable
    />
  </Form.Group>
      )}
    </>
      )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCloseHandler}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Availability</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvailabilityModal;