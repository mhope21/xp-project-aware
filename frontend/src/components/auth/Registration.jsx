import React, { useState } from "react";
import { API_URL2 } from "../../constants";
import { Link, useNavigate } from "react-router-dom";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registrationMessages, setRegistrationMessages] = useState("");
  const navigate = useNavigate();
  


  const [userData, setUserData] = useState({});

  const registrationUrl = `${API_URL2}/signup`;
  // Handles initial signup, sets default role as user since only admin can assign a user as admin. Uses a POST action to sign up new user.
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    // Update the userData state
    const updatedUserData = {
        user: {
          email,
          password,
          name,
          role: "user",
        },
      };

    setUserData(updatedUserData);

    try {
      // Send POST request to registration endpoint
      const response = await fetch(registrationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        // Handle successful registration (e.g., redirect to another page)
        console.log("Registration successful!");
        setRegistrationMessages("Registration successful!")

        // Clear input fields
      setEmail("");
      setPassword("");
      setName("");

        navigate("/login")
      } else {
        // Handle registration error
        const errorData = await response.json();
        setRegistrationMessages(errorData.status.errors.join(", ") || "Registration failed");
      }
    } catch (error) {
      // Handle network or other errors
      setRegistrationMessages("An error occurred: " + error.message);
      console.log(error.message)
    }
  };

  return (
    // Displays form for registration
    <div>
      <section className="page-section" id="register">
      <div className="container mt-5 p-5 rounded bg-light w-50"  style={{
            boxShadow: '25px 25px 55px rgba(0, 0, 0, 0.5)', 
            borderTop: '1.5px solid rgba(255, 255, 255, 0.5)',
            borderLeft: '1.5px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px) '}}>
          <div className="text-center mb-5">
            <h2 className="section-heading text-uppercase text-dark">Register</h2>
          </div>

          <div className={registrationMessages ? "text-center text-danger text-bold mb-3" : "d-none"} id="submitErrorMessage">
            {registrationMessages && <p>{registrationMessages}</p>}
            </div>

          <form
            id="registerForm"
            data-sb-form-api-token="API_TOKEN"
            onSubmit={handleSubmit}
            
          >
            <div className="container w-75">
            <div className="mb-5">
              <div>
                <div className="form-group">
                  <input
                    className="form-control shadow"
                    id="name"
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name *"
                    data-sb-validations="required"
                  />
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="name:required"
                  >
                    A name is required.
                  </div>
                </div>
                <div className="form-group">
                  <input
                    className="form-control shadow"
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email *"
                    data-sb-validations="required,email"
                  />
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="email:required"
                  >
                    An email is required.
                  </div>
                  <div className="invalid-feedback" data-sb-feedback="email:email">
                    Email is not valid.
                  </div>
                </div>
                <div className="form-group mb-md-0">
                  <input
                    className="form-control shadow"
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your Password *"
                    data-sb-validations="required"
                  />
                  <div
                    className="invalid-feedback"
                    data-sb-feedback="password:required"
                  >
                    A password is required.
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* <div className="d-none" id="submitSuccessMessage">
                    <div className="text-center text-primary mb-3">Message sent!</div> 
                    </div> */}

            

            <div className="text-center">
              <button
                className="btn btn-primary btn-lg text-uppercase mb-3 shadow"
                id="submitButton"
                type="submit"
              >
                Submit
              </button>
              <Link to="/login"><p>Already signed up? Login now.</p></Link>
            </div>
            
          </form>
        </div>
      </section>
    </div>

  );
}
