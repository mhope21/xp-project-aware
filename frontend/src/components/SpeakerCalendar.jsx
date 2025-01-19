import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { API_URL } from "../constants";
import AvailabilityModal from "./AvailabilityModal";
import { useLocation } from "react-router-dom";
import BookingModal from "./BookingModal";

const SpeakerCalendar = ({ user, speakerId }) => { 
  const [events, setEvents] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [availabilityToEdit, setAvailabilityToEdit] = useState(null);

  const jwt = localStorage.getItem('jwt');

  const fetchAvailabilities = async (month, year, speakerId) => {
    try {
      console.log("API Request Speaker ID:", speakerId);
      const response = await fetch(
        `${API_URL}/availabilities?month=${month}&year=${year}&speaker_id=${speakerId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedEvents = data.map((avail) => ({
        id: avail.id,
        title: "Speaker Availability",
        start: avail.start_time,
        end: avail.end_time,
        backgroundColor: avail.color || "#4CAF50",
      }));

      setEvents(formattedEvents);
      setAvailabilities(data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const handleEdit = (availability) => {
    setAvailabilityToEdit(availability);
    setModalIsOpen(true);
   };

  const handleDateClick = (info) => {
    if (user?.role === "teacher") {
      const calendarApi = info.view.calendar;
      calendarApi.changeView("timeGridDay", info.dateStr);
    } else if (user?.role === "speaker") {
      const localDate = new Date(info.dateStr);
      setSelectedDate(localDate);
      setModalIsOpen(true);
    }
  };
  
  const handleEventClick = (info) => {
    if (user?.role === "teacher") {
      setSelectedAvailability(info.event);
      setModalIsOpen(true);
    }
  };

  const handleDelete = async (availabilityId) => {
    try {
      const response = await fetch(`${API_URL}/availabilities/${availabilityId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('jwt')}`, "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setAvailabilities((prevAvailabilities) => prevAvailabilities.filter((avail) => avail.id !== availabilityId));
        
        setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== availabilityId)
      );
      alert("The availability has been deleted.")

      } else {
        const errorData = await response.json();
        alert(`Error deleting availability: ${errorData.errors.join(',')}`);
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert("An error occurred while deleting the availability.");
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    fetchAvailabilities(month, year, speakerId);
  }, [speakerId]);

  const handleToggleTable = () => {
    setShowTable((prevShowTable) => {
      const newShowTable = !prevShowTable;
  
      // Fetch availabilities only when showing the table
      if (newShowTable) {
        const month = new Date().getMonth() + 1; // Current month
        const year = new Date().getFullYear(); // Current year
        fetchAvailabilities(month, year, speakerId);
      }
  
      return newShowTable;
    });
  };
  

  const handleDateChange = (info) => {
    const calendarApi = info.view.calendar;
    const currentDate = calendarApi.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    fetchAvailabilities(month, year, speakerId);
    
  };


  return (
    <div>
      <div className="page-section">
        <div className="container w-75">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventMouseEnter={(info) => {
              const tooltip = document.createElement("div");
              tooltip.innerHTML = `
                <div style="padding: 8px; background: white; border: 1px solid black; z-index: 1000;">
                   ${info.event.title}<br/>
                  <strong>Start:</strong> ${info.event.start}<br/>
                  <strong>End:</strong> ${info.event.end}
                </div>`;
              tooltip.style.position = "absolute";
              tooltip.style.top = `${info.jsEvent.pageY + 10}px`;
              tooltip.style.left = `${info.jsEvent.pageX + 10}px`;
              tooltip.id = "calendar-tooltip";
              document.body.appendChild(tooltip);
            }}
            eventMouseLeave={() => {
              const tooltip = document.getElementById("calendar-tooltip");
              if (tooltip) tooltip.remove();
            }}
            datesSet={handleDateChange}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
          />
         {user?.role === "speaker" && (
            <AvailabilityModal
              speakerId={speakerId}
              isOpen={modalIsOpen}
              onClose={() => setModalIsOpen(false)}
              selectedDate={selectedDate}
              setEvents={setEvents}
              availability={availabilityToEdit}
              setAvailabilities={setAvailabilities}
            />
          )}
          {user?.role === "teacher" && (
            <BookingModal
              isOpen={modalIsOpen}
              user={user}
              speakerId={speakerId}
              onClose={() => setModalIsOpen(false)}
              selectedAvailability={selectedAvailability}
              onBookingSuccess={(updatedEvent) => {
                setEvents((prevEvents) =>
                  prevEvents.map((event) =>
                    event.id === updatedEvent.id
                      ? { ...event, isBooked: true, backgroundColor: "#FF0000" } // Red for booked
                      : event
                  )
                );
              }}
            />
          )}
        </div>

        <div style={{  marginLeft: 60, marginRight: 60 }}>
          {user?.role === "teacher" && ( <p> Click on a date to view the day view of the calendar. Then click on a speaker's availability to create a booking for that date. Note: must be within availability window. </p> )}
          {user?.role === "speaker" && ( <p> Click on a date to create an availability for that date. </p> )} </div>

        <div className="btn btn-primary text-center d-flex justify-content-center" onClick={handleToggleTable}>
        {showTable ? 'Hide Table' : 'Show Table'}
      </div>

      {showTable && (
        <>
        <div className="other-card-header mt-5" ><h6>Monthly Availabilities</h6></div>
       <table className="w-100">
       <thead>
         <tr>
           <th>Speaker ID</th>
           <th>Start Time</th>
           <th>End Time</th>
           <th>Is Recurring</th>
           <th>Recurring End Date</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>
         {availabilities.map((availability) => (
           <tr key={availability.id}>
             <td>{availability.speaker_id}</td>
             <td>{new Date(availability.start_time).toLocaleString()}</td>
             <td>{new Date(availability.end_time).toLocaleString()}</td>
             <td>{availability.recurring_availability_id ? "Yes" : "No"}</td>
             <td>
               {availability.recurring_availability?.end_date
                 ? new Date(availability.recurring_availability?.end_date).toLocaleDateString()
                 : "N/A"}
             </td>
             <td>
              <div className="btn-group">
              <div className="btn btn-primary btn-small" onClick={() => handleEdit(availability)}>Edit</div>
             <div className="btn btn-danger btn-small"onClick={() => handleDelete(availability.id)}>Destroy</div>
             </div>
             </td>
           </tr>
         ))}
       </tbody>
     </table>
     </>
      )}
    </div>
  </div>
  );
};

export default SpeakerCalendar;