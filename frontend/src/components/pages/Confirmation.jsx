import React, { useEffect } from "react";
import { API_URL } from "../../constants";
import { useLocation } from "react-router-dom";

function Confirmation({ user }) {
  // Default to 'Guest' if no user name
  const current_user = user?.name || "Guest";
  const location = useLocation();
  const { user, bookingDetails, productType } = location.state || {}; 

  // Scroll to top on render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section id="confirmation">
        <div
          className="container border bg-white w-60 h-100 p-5 rounded"
          style={{ marginTop: 40 }}
        >
          <div className="text-center">
            <h4 className="section-heading text-uppercase">
              Thank You, {current_user}!
            </h4>

            {/* Conditionally render based on product type */}
            {productType === "Booking" ? (
              <>
                
            <h5 className="section-subheading mb-5">
            Your booking has been successfully confirmed!
            </h5>
            <div className="text-muted">
            <p>
                <strong>Speaker:</strong> {bookingDetails.speaker?.name || "N/A"}
            </p>
            <p>
                <strong>Event:</strong> {bookingDetails.event?.title || "N/A"}
            </p>
            <p>
                <strong>Location:</strong> {bookingDetails.organization || "N/A"}
            </p>
            <p>{bookingDetails.address || "No address provided"}</p>
            <p>
                <strong>Start Time:</strong> {bookingDetails.startTime || "N/A"}
            </p>
            <p>
                <strong>End Time:</strong> {bookingDetails.endTime || "N/A"}
            </p>
            <p>
                <strong>Status:</strong> {bookingDetails.status || "N/A"}
            </p>
            </div>
            <h5 className="text-muted">
            You will be receiving an email confirmation soon.
            </h5>
              </>
            ) : (
              <>
                <h5 className="section-subheading mb-5">
                  We hope you and your students enjoy the kit!
                </h5>
                <h5 className="text-muted">
                  You will be receiving an email confirmation soon.
                </h5>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Confirmation;