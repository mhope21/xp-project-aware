import React, {useContext, useEffect} from "react";
import { AuthContext } from "../auth/AuthContext";
import { useLocation } from "react-router-dom";

function Confirmation() {
  const { user } = useContext(AuthContext);
  // Displays confirmation for kit request success
  const current_user = user?.name || "Guest";
  const location = useLocation();
  const { bookingDetails, kitOrderData } = location.state || {};
  const { event, organization, address, startTime, endTime, phone, comments, schoolYear, productType } = bookingDetails || {};

  const { order } = kitOrderData || {};
  const { product } = order || {};
  const { name, description } = product || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="confirmation">
      <div className="container border bg-white w-60 h-100 p-5 rounded" style={{ marginTop: 40 }}>
        <div className="text-center">
          <h4 className="section-heading text-uppercase">
            Thank You, {user?.name || "Guest"}!
          </h4>

          {productType === "Booking" ? (
            <>
              <h5 className="section-subheading mb-5">
                Your booking has been successfully created!
              </h5>
              <div className="booking-information">
                <h1 className="booking-title">Booking Information</h1>
                <div className="booking-details">
                  <p className="detail">
                    <strong className="label">Event Title:</strong> {event.title}
                  </p>
                  <p className="detail">
                    <strong className="label">Event Description:</strong> {event.description}
                  </p>
                  <p className="detail">
                    <strong className="label">Location:</strong> {organization}, {address.street_address}, {address.city}, {address.state}, {address.postal_code}
                  </p>
                  <p className="detail">
                    <strong className="label">Event Start Time:</strong> {new Date(startTime).toLocaleString()}
                  </p>
                  <p className="detail">
                    <strong className="label">Event End Time:</strong> {new Date(endTime).toLocaleString()}
                  </p>
                  <p className="detail">
                    <strong className="label">Phone:</strong> {phone}
                  </p>
                  <p className="detail">
                    <strong className="label">Comments:</strong> {comments}
                  </p>
                </div>
              </div>
              <h5 className="text-muted">
                You will be receiving an email confirmation soon.
              </h5>
            </>
          ) : kitOrderData ? (
            <>
              <h5 className="section-subheading mb-5">
                Your kit order has been successfully placed!
              </h5>
              <div className="booking-information">
              <h1 className="booking-title">Kit Information</h1>
            <div className="booking-details">
              <p className="detail">
                <strong className="label">Kit Name:</strong> {name}
              </p>
              <p className="detail">
                <strong className="label">Kit Description:</strong> {description}
              </p>
                </div>
              </div>
              <h5 className="text-muted">
                You will be receiving an email confirmation soon.
              </h5>
            </>
          ) : (
            <h5 className="text-danger">
              No details available. Please check your email for confirmation.
            </h5>
          )}
        </div>
      </div>
    </section>
  );
}

export default Confirmation;
