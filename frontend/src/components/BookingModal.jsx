import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { API_URL } from "../constants";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

const BookingModal = ({ isOpen, onClose, selectedAvailability, speakerId, onBookingSuccess, user }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productType] = useState("Booking");
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    speaker: "",
    organization: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setBookingDetails({
        name: user?.name || "",
        speaker: speakerId || 2,
        organization: user?.organization || "",
        address: user?.organizationAddress || "",
      });
    }
  }, [user, speakerId]);

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required("Phone is required"),
    comments: Yup.string().notRequired(),
  });

  const jwt = localStorage.getItem("jwt");

  const handleSubmit = async (values, {setSubmitting}) => {
    setSubmitting(true);

    const data = {
        order: {
            user_id: user.id,
            phone: values.phone,
            product_id: booking?.id || "",
            product_type: productType,
            comments: values.comments,
            address_id: user.organization?.address?.id,
            school_year: schoolYear,
        }
    }
  }

  // Fetch speaker events
    useEffect(() => {
        if (!speakerId) return;
    
        const fetchEvents = async () => {
        try {
            const response = await fetch(`${API_URL}/events?speaker_id=${speakerId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            });
    
            if (!response.ok) throw new Error("Failed to fetch events.");
    
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            console.error(err);
        }
        };
    
        fetchEvents();
    }, [speakerId]);

  const handleBooking = async () => {
    if (!selectedEvent || !startTime || !endTime) {
      setError("All fields are required.");
      return;
    }

    const availabilityStart = new Date(selectedAvailability.start);
    const availabilityEnd = new Date(selectedAvailability.end);
    const selectedStart = new Date(startTime);
    const selectedEnd = new Date(endTime);

    if (selectedStart < availabilityStart || selectedEnd > availabilityEnd) {
      setError("Selected time range is outside the availability.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          start_time: startTime,
          end_time: endTime,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create the booking.");
      }

      const updatedBooking = await response.json();

      onBookingSuccess(updatedBooking);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Booking Modal"
      style={{
        content: {
          width: "400px",
          margin: "auto",
          padding: "20px",
        },
      }}
    >
      <h2>Create a Booking</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>
          Select Event:
          <select
            value={selectedEvent ? selectedEvent.id : ""}
            onChange={(e) =>
              setSelectedEvent(events.find((event) => event.id === parseInt(e.target.value)))
            }
          >
            <option value="" disabled>
              Choose an event
            </option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({event.description})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          End Time:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleBooking}
          disabled={loading}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
        <button
          onClick={onClose}
          style={{
            marginLeft: "10px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default BookingModal;