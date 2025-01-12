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
        title: "Available",
        start: avail.start_time,
        end: avail.end_time,
        backgroundColor: avail.color || "#4CAF50", // Default to green if no color
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const handleDateClick = (info) => {
    console.log("Date clicked:", info.dateStr);
  
    // Parse the date and force local time
    const localDate = new Date(info.dateStr);
    
    console.log("Local Date:", localDate);
    setSelectedDate(localDate);
    setModalIsOpen(true);
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
            datesSet={handleDateChange}
            dateClick={handleDateClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
          />
          <AvailabilityModal
            speakerId={user?.id}
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default SpeakerCalendar;