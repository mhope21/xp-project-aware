import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { API_URL } from '../constants';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

const SpeakerEvents = ({ user, speakerId }) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events?speaker_id=${speakerId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [speakerId]);

  const handleCreateEdit = (event = null) => {
    setEventToEdit(event);
    setTitle(event ? event.title : '');
    setDescription(event ? event.description : '');
    setDuration(event ? event.duration : 60);
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        alert("The event has been deleted.");
      } else {
        const errorData = await response.json();
        alert(`Error deleting event: ${errorData.errors.join(', ')}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('An error occurred while deleting the event.');
    }
  };

  const handleSubmit = async () => {
    if (!title || !duration) {
      alert("Please provide title and duration.");
      return;
    }

    const newEvent = {
      event: {
        speaker_id: speakerId,
        title,
        description,
        duration,
      }
    };

    try {
      const response = await fetch(
        eventToEdit ? `${API_URL}/events/${eventToEdit.id}` : `${API_URL}/events`,
        {
          method: eventToEdit ? "PATCH" : "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEvents((prevEvents) => {
          if (eventToEdit) {
            return prevEvents.map((event) => (event.id === data.id ? data : event));
          } else {
            return [...prevEvents, data];
          }
        });

        setIsModalOpen(false);
        alert(`The event has been ${eventToEdit ? 'updated' : 'created'}.`);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.errors.join(', '));
      }
    } catch (error) {
      console.error('Error creating/updating event:', error);
      setErrorMessage('An error occurred while creating/updating the event.');
    }
  };

  const onCloseHandler = () => {
    setErrorMessage('');
    setIsModalOpen(false);
  };

  return (
    <div>
      <table className='w-100'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Duration (minutes)</th>
            {user?.role === "speaker" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.duration}</td>
              {user?.role === "speaker" && (
                <td>
                    <div className='btn-group'>
                  <div className='btn btn-primary btn-small' onClick={() => handleCreateEdit(event)}>Edit</div>
                  <div className='btn btn-danger btn-small' onClick={() => handleDelete(event.id)}>Delete</div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {user?.role === "speaker" && (
        <div className='btn btn-primary d-flex justify-content-center align-items-center mt-5' onClick={() => handleCreateEdit()}>Create Event</div>
      )}

      <Modal show={isModalOpen} onHide={onCloseHandler}>
        <Modal.Header closeButton>
          <Modal.Title>{eventToEdit ? 'Edit Event' : 'Create New Event'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCloseHandler}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Event</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SpeakerEvents;
