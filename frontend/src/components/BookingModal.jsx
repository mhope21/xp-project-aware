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
  const [comments, setComments] = useState(null);
  const [phone, setPhone] = useState(null);
  const [schoolYear, setSchoolYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productType] = useState("Booking");
  const navigate = useNavigate()
  const [updatedBooking, setUpdatedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    speaker: "",
    organization: "",
    address: "",
  });

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
      return false; // Validation failed
    }

    // Clear error if validation passes
    setError("");
    return true; // Validation passed
  };

  useEffect(() => {
    if (user) {
      setBookingDetails({
        name: user?.name || "",
        speaker: speakerId || "",
        organization: user?.organization || "",
        address: user?.organizationAddress || "",
        event: selectedEvent ? { id: selectedEvent.id, title: selectedEvent.title } : "",
      startTime: updatedBooking?.startTime || startTime || "",
      endTime: updatedBooking?.endTime || endTime || "",
      status: updatedBooking?.status || "pending",
      });
    }
  }, [user, speakerId, updatedBooking]);

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required("Phone is required"),
    comments: Yup.string().notRequired(),
  });

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
  const createBooking = async (values) => {
    const data = {
      start_time: startTime,
      end_time: endTime,
      event_id: selectedEvent?.id,
      status: 0,
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
      setUpdatedBooking(order);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleBooking = async (values) => {
    console.log(user)

    if (!selectedEvent || !startTime || !endTime) {
      setError("All fields are required.");
      return;
    }

    if (!user.address || !user.organization) {
        setError("You must complete your profile with Organization and Address.")
    }

    const availabilityStart = new Date(selectedAvailability.start);
    const availabilityEnd = new Date(selectedAvailability.end);
    const selectedStart = new Date(startTime);
    const selectedEnd = new Date(endTime);
    console.log(availabilityStart, selectedStart)
    console.log(availabilityEnd, selectedEnd)

    if (!validateTimeRange(selectedStart, selectedEnd, availabilityStart, availabilityEnd)) {
        console.error("Invalid time range selected.");
        return;
    }

    const data = {
        order: {
            user_id: user.id,
            phone: values.phone,
            product_id: '', // No booking.id available yet
            product_type: productType,
            comments: values.comments,
            address_id: user.organization?.address?.id,
            school_year: schoolYear,
            event_id: selectedEvent.id,
            start_time: startTime,
            end_time: endTime,
            status: 0,
        }
    };
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create the booking.");
      }

      const updatedBookingData = await response.json();
      setUpdatedBooking(updatedBookingData); // Update the state with the response
      console.log("Booking and Order created: ", updatedBooking)
      onBookingSuccess(updatedBookingData);
      onClose();
      navigate("/confirmation", {
        state: { user, bookingDetails, productType },
      });
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
            backgroundColor: "rgba(0, 0, 0, 0.75)", // Faded black background
            zIndex: 1000, // Ensure it appears above other elements
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
        timeIntervals={15} // You can adjust time intervals
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
        timeIntervals={15} // Adjust intervals
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