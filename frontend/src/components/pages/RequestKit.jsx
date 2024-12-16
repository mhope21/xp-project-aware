import React, { useEffect, useState } from "react";
import { API_URL } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";

function RequestKit({ user }) {
  const location = useLocation();
  const kitId = location.state?.kitId || "";
  const kitName = location.state?.kitName || "";

  const [orderMessages, setOrderMessages] = useState("");  
  const ordersUrl = `${API_URL}/orders`;
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();

  const [orderForm, setOrderForm] = useState({
    phone: "",
    schoolName: "",
    schoolAddress: "",
    comments: "",
    schoolYear: "",
    email: user ? user.email : "",
    firstName: user ? user.first_name : "",
    lastName: user ? user.last_name : "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const data = {
      order: {
        phone: orderForm.phone,
        school_address: orderForm.schoolAddress,
        school_name: orderForm.schoolName,
        school_year: orderForm.schoolYear,
        kit_id: kitId,
        comments: orderForm.comments,
      },
    };
    
    if (!jwt) {
      console.log("No user logged in. Please log in to continue.");
      // Redirect to login
      navigate("/login");
      return;
    }


    try {
      // Send POST request to registration endpoint
      const response = await fetch(ordersUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Handle successful registration
        console.log("Order saved.");
        alert("Your order has been processed.");

        navigate("/confirmation");
      } else {
        // Handle request error
        const errorData = await response.json();
        const errorMessages = errorData.errors.map((error) => {
          return error.replace("School year ", "");
        });
        setOrderMessages(errorMessages.join(", ") || "Order failed");
      }
    } catch (error) {
      // Handle network or other errors
      setOrderMessages("An error occurred: " + error.message);
      console.log(error);
    }
  };

  return (
    // Displays form for requesting a kit
    <>
      <div className="black-strip"></div>
      <div>
        <section className="page-section" id="register">
          <div
            className="container mt-5 p-5 rounded bg-light w-50"
            style={{
              boxShadow: "25px 25px 55px rgba(0, 0, 0, 0.5)",
              borderTop: "1.5px solid rgba(255, 255, 255, 0.5)",
              borderLeft: "1.5px solid rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px) ",
            }}
          >
            <div className="text-center mb-5">
              <h4 className="text-center section-heading text-uppercase text-dark">
                Order A Kit
              </h4>
            </div>

            <div
              className={
                orderMessages
                  ? "text-center text-dark text-bold mb-3"
                  : "d-none"
              }
              id="submitErrorMessage"
            >
              {orderMessages && <p>{orderMessages}</p>}
            </div>

            <form
              id="registerForm"
              data-sb-form-api-token="API_TOKEN"
              onSubmit={handleSubmit}
            >
              <div className="container text-dark">
                <div className="mb-5">
                  <div>
                    <div className="form-group">
                      {/* Added input fields for first name and last name*/}
                      <label for="firstName">First Name:</label>
                      <input
                        type="text"
                        className="form-control shadow"
                        id="firstName"
                        name="firstName"
                        value={orderForm.firstName}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label for="lastName">Last Name:</label>
                      <input
                        type="text"
                        className="form-control shadow"
                        id="lastName"
                        name="lastName"
                        value={orderForm.lastName}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        className="form-control shadow"
                        id="email"
                        type="email"
                        name="email"
                        value={orderForm.email}
                        readOnly
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone:</label>
                      <input
                        className="form-control shadow mb-5"
                        id="phone"
                        type="tel"
                        name="phone"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({...orderForm, phone:e.target.value})}
                        placeholder="123-456-7890*"
                        data-sb-validations="required"
                        required
                      />
                    </div>
                    <div
                      className="invalid-feedback"
                      data-sb-feedback="phone:required"
                    >
                      A phone number is required.
                    </div>
                    <div className="form-group">
                      <label htmlFor="schoolName">School Name:</label>
                      <input
                        className="form-control shadow mb-5"
                        id="schoolName"
                        type="text"
                        name="schoolName"
                        value={orderForm.schoolName}
                        onChange={(e) => setOrderForm({...orderForm, schoolName:e.target.value})}
                        placeholder="City High School*"
                        data-sb-validations="required"
                        required
                      />
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="schoolName:required"
                      >
                        A school name is required.
                      </div>
                    </div>
                    {/* Stretch Goal: Integrate API with US schools? */}
                    <div className="form-group">
                      <label htmlFor="schoolAddress">School Address:</label>
                      <input
                        className="form-control shadow mb-5"
                        id="schoolAddress"
                        type="text"
                        name="schoolAddress"
                        value={orderForm.schoolAddress}
                        onChange={(e) => setOrderForm({...orderForm, schoolAddress:e.target.value})}
                        placeholder="123 Example Street, City, ST 12345*"
                        data-sb-validations="required"
                        required
                      />
                      <div
                        className="invalid-feedback"
                        data-sb-feedback="schoolAddress:required"
                      >
                        A school address is required.
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="schoolYear">School Year:</label>
                    <input
                      className="form-control shadow mb-5"
                      id="schoolYear"
                      type="text"
                      name="schoolYear"
                      value={orderForm.schoolYear}
                      onChange={(e) => setOrderForm({...orderForm, schoolYear:e.target.value})}
                      placeholder="YYYY-YYYY*"
                      data-sb-validations="required"
                      required
                    />
                    <div
                      className="invalid-feedback"
                      data-sb-feedback="schoolYear:required"
                    >
                      A school year is required.
                    </div>
                    <div className="form-group">
                      <label htmlFor="kitName">Kit Name:</label>
                      <input
                        className="form-control shadow mb-5"
                        id="kitName"
                        type="text"
                        name="kitName"
                        value={kitName}
                        readOnly
                      />
                    </div>
                    <div className="form-group form-group-textarea mb-md-0">
                      <label htmlFor="comments">Order Comments:</label>
                      <textarea
                        className="form-control shadow mb-5"
                        id="comments"
                        name="comments"
                        type="text"
                        value={orderForm.comments}
                        onChange={(e) => setOrderForm({...orderForm, comments:e.target.value})}
                        placeholder="Your Message *"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary btn-lg text-uppercase mb-3"
                  id="submitButton"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

export default RequestKit;
