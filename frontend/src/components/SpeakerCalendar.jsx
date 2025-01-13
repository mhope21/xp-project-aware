import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { API_URL } from "../constants";
import AvailabilityModal from "./AvailabilityModal";

const SpeakerCalendar = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const jwt = localStorage.getItem('jwt');

  const fetchAvailabilities = async (month, year, speakerId) => {
    try {
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
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
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
      setSelectedEvent(info.event);
      setModalIsOpen(true);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const speakerId = user?.id;

    if (speakerId) {
      fetchAvailabilities(month, year, speakerId);
    }
  }, [user]);

  const handleDateChange = (info) => {
    const calendarApi = info.view.calendar;
    const currentDate = calendarApi.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const speakerId = user?.id;

    if (speakerId) {
      fetchAvailabilities(month, year, speakerId);
    }
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
              speakerId={user.id}
              isOpen={modalIsOpen}
              onClose={() => setModalIsOpen(false)}
              selectedDate={selectedDate}
              setEvents={setEvents}
            />
          )}
          {user?.role === "teacher" && (
            <BookingModal
              isOpen={modalIsOpen}
              user={user}
              onClose={() => setModalIsOpen(false)}
              selectedEvent={selectedEvent}
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
      </div>
    </div>
  );
};

export default SpeakerCalendar;