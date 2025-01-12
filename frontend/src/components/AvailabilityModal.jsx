import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css'; // If using a time picker like react-datepicker
import DatePicker from 'react-datepicker'; // For time picker
import { SketchPicker } from 'react-color'; // For color picker

const AvailabilityModal = ({ speakerId, isOpen, onClose, selectedDate }) => {
  const [startTime, setStartTime] = useState(new Date(selectedDate));
  const [endTime, setEndTime] = useState(new Date(selectedDate));
  const [color, setColor] = useState("#4CAF50"); // Default color red

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
        alert("Please select both start and end times.");
        return;
      }

    const newAvailability = {
      speaker_id: speakerId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      color: color, // Pass the selected color
    };

    try {
      const response = await fetch(`${API_URL}/availabilities`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAvailability),
      });

      if (response.ok) {
        const data = await response.json();
        
        const newEvent = {
            id: data.id,
            title: "Available",
            start: data.start_time,
            end: data.end_time,
            backgroundColor: data.color,
          };
      
          setEvents((prevEvents) => [...prevEvents, newEvent]);

          onClose(); // Close the modal after creation
      } else {
        console.error("Error creating availability");
      }
    } catch (error) {
      console.error("Error creating availability:", error);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Availability</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Start Time</Form.Label>
            <DatePicker
              selected={new Date(selectedDate)}
              onChange={date => setStartTime(date)}
              showTimeSelect
              dateFormat="Pp"
              timeIntervals={15} // Time intervals for the time picker
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>End Time</Form.Label>
            <DatePicker
              selected={new Date(selectedDate)}
              onChange={date => setEndTime(date)}
              showTimeSelect
              dateFormat="Pp"
              timeIntervals={15}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Event Color</Form.Label>
            <SketchPicker
              color={color}
              onChangeComplete={(color) => setColor(color.hex)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Availability</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvailabilityModal;