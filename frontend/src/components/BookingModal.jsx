import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { API_URL } from "../constants";
import * as Yup from "yup";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ isOpen, onClose, selectedAvailability, speakerId, onBookingSuccess, user }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startTime, setStartTime] = useState(null); 
  const [endTime, setEndTime] = useState(null);
  const [comments, setComments] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [productType] = useState("Booking");
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedAvailability) {
      setStartTime(new Date(selectedAvailability.start)); 
      setEndTime(new Date(selectedAvailability.end));
    }
  }, [selectedAvailability]);
  

  // Validation function
  const validateTimeRange = (selectedStart, selectedEnd, availabilityStart, availabilityEnd) => {
    if (selectedStart < availabilityStart || selectedEnd > availabilityEnd) {
      setError("Selected time range is outside the availability.");
      return false;
    }

    // Clear error if validation passes
    setError("");
    return true;
  };

  const jwt = localStorage.getItem("jwt");

  // Fetch speaker events
    useEffect(() => {
        if (!speakerId) return;
    
        const fetchEvents = async () => {
        try {
            console.log("Getting events.")
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

    // Handle booking creation
  const createBooking = async () => {
    const data = {
      start_time: startTime,
      end_time: endTime,
      event_id: selectedEvent?.id,
      status: 0,
      availability_id: selectedAvailability?.id,
    };

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create the booking.");
      const booking = await response.json();
      return booking;
    } catch (err) {
      throw new Error(err.message);
    }
  };

   // Handle order creation
   const createOrder = async (bookingId) => {
    const data = {
      user_id: user.id,
      product_id: bookingId,
      product_type: productType,
      address_id: user.organization?.address?.id,
      school_year: schoolYear,
      phone: phone,
      comments: comments,
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create the order.");
      const order = await response.json();
      return order;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    setError("");
  
    // Validate input fields
    if (!selectedEvent || !startTime || !endTime || !phone || !schoolYear) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
  
    // Parse and validate time range
    const availabilityStart = new Date(selectedAvailability.start);
    const availabilityEnd = new Date(selectedAvailability.end);
    const selectedStart = new Date(startTime);
    const selectedEnd = new Date(endTime);
  
    if (!validateTimeRange(selectedStart, selectedEnd, availabilityStart, availabilityEnd)) {
      setLoading(false);
      return;
    }
  
    try {
        // Create booking and order in one flow
        const booking = await createBooking();
        const order = await createOrder(booking.id);

        console.log("Booking:", booking);
        console.log("Order:", order);
      
        onBookingSuccess(booking); 
        onClose();

        const bookingDetails = {
            name: user?.name,
            organization: user?.organization?.name,
            address: {
              street_address: user?.organization?.address?.street_address,
              city: user?.organization?.address?.city,
              state: user?.organization?.address?.state,
              postal_code: user?.organization?.address?.postal_code,
            },
            event: {
              id: booking.event.id,
              title: booking.event.title,
              speaker_id: booking.event.speaker_id,
              description: booking.event.description,
              duration: booking.event.duration,
            },
            startTime: booking.start_time,
            endTime: booking.end_time,
            phone: order.order.phone,
            comments: order.order.comments,
            schoolYear: order.order.school_year,
            productType: order.order.product_type,
          };

          navigate("/confirmation", { state: { bookingDetails } });

          
          
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
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 1000,
          },
        content: {
          width: "400px",
          margin: "auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          top: "20%",
          transform: "translateY(-10%)",
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
          <DatePicker
        selected={startTime}
        onChange={(date) => setStartTime(date)}
        showTimeSelect
        dateFormat="Pp"
        timeIntervals={15}
        timeCaption="Time"
      />
        </label>
      </div>
      <div>
        <label>
          End Time:
          <DatePicker
        selected={endTime}
        onChange={(date) => setEndTime(date)}
        showTimeSelect
        dateFormat="Pp"
        timeIntervals={15}
        timeCaption="Time"
      />
        </label>
      </div>

      <div>
        <label>
          Phone:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </label>
      </div>
      <div>
        <label>
          School Year:
          <input
            type="text"
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            placeholder="YYYY-YYYY"
          />
        </label>
      </div>

      <div>
        <label>
          Comments:
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments"
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