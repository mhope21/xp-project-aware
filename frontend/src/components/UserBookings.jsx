import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModifyBooking from "./ModifyBooking";
import { AuthContext } from "./auth/AuthContext";
import moment from "moment-timezone";
import SpeakerBookings from "./SpeakerBookings";
import { API_URL } from "../constants";

const UserBookings = ({ profile }) => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [userRole, setUserRole] = useState(user?.role);
  const [speakerBookings, setSpeakerBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const jwt = localStorage.getItem("jwt");

    // Fetch bookings by speaker from the backend
    useEffect(() => {
      const fetchSpeakerBookings = async () => {
        if (userRole === "speaker" && user?.id) {
          try {
            const response = await fetch(`${API_URL}/${user.id}/bookings`,
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
            setSpeakerBookings(data);
            setIsLoading(false);

          } catch (error) {
            console.error("Error fetching speaker bookings:", error);
            setIsLoading(false);
          }
        }
      };
      fetchSpeakerBookings();
    }, [userRole, user?.id]);

  const convertUTCToCST = (utcDate) => {
    return moment(utcDate).tz("America/Chicago").toISOString();
  };

  useEffect(() => {
    if (userRole === "teacher") {
      setBookings(profile?.bookings || []);
    }
  }, [profile, userRole]);

  const handleUpdate = (updatedBooking) => {
    const updatedBookingCST = {
      ...updatedBooking,
      start_time: moment(updatedBooking.start_time).tz,
      end_time: moment(updatedBooking.end_time).tz,
    };

    setBookings((prevBookings) =>
      prevBookings.map((booking) => {
        const currentId =
          userRole === "teacher" ? booking.id : booking.data?.attributes?.id;
        const updatedId =
          userRole === "teacher" ? updatedBooking.id : updatedBooking.data.id;
        console.log(
          `Comparing IDs - Current: ${currentId}, Updated: ${updatedId}`
        );
        return currentId === updatedId ? updatedBookingCST : booking;
      })
    );
    console.log("After update - Updated Bookings:", bookings);
  };

  return (
    <div>
      {/* Teacher's bookings section */}
      {userRole === "teacher" && bookings.length > 0 && (
        <table
          className="table table-striped"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th style={{ padding: "10px" }}>Event</th>
              <th style={{ padding: "10px" }}>Speaker</th>
              <th style={{ padding: "10px" }}>Start Time</th>
              <th style={{ padding: "10px" }}>End Time</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td style={{ padding: "10px" }}>
                  {booking.event_name || "No event name provided"}
                </td>
                <td style={{ padding: "10px" }}>
                  {booking?.event_speaker
                    ? `${booking.event_speaker.first_name} ${booking.event_speaker.last_name}`
                    : "No speaker name provided"}
                </td>
                <td style={{ padding: "10px" }}>
                  {moment(booking.start_time).tz}
                </td>
                <td style={{ padding: "10px" }}>
                  {moment(booking.end_time).tz}
                </td>
                <td
                  style={{
                    padding: "10px",
                    color:
                      booking.status === "confirmed"
                        ? "green"
                        : booking.status === "declined"
                        ? "red"
                        : "blue",
                  }}
                >
                  {booking.status?.toUpperCase() || "No status provided"}
                </td>
                <td style={{ padding: "10px" }}>
                  <ModifyBooking
                    booking={booking}
                    userRole={userRole}
                    onUpdate={handleUpdate}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Speaker's bookings section */}
      {userRole === 'speaker' && !isLoading && (
        <SpeakerBookings speakerBookings={speakerBookings} />
      )}

      {userRole === 'speaker' && isLoading && <p>Loading your bookings...</p>}

      {/* Teacher's "Book a Speaker" button */}
      <div className="d-flex justify-content-center align-items-center mt-5">
        {profile?.role === "teacher" && (
          <Link to="/speaker" className="btn btn-primary btn-small">
            Book a Speaker
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
