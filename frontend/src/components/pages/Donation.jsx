import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { STRIPE_PAYLINK } from "../../constants";
import { API_URL,STRIPE_PK } from "../../constants";
import { loadStripe } from "@stripe/stripe-js";
import { AuthContext } from '../auth/AuthContext';

const jwt = localStorage.getItem('jwt');
const paymentLinkUrl = STRIPE_PAYLINK;
const stripePromise = loadStripe(STRIPE_PK);

function Donation() {
  const { user } = useContext(AuthContext);
  const [errorMessages, setErrorMessages] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const donationsUrl = `${API_URL}/donations`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAmountClick = (value) => {
    setAmount(value);
  };

  const handleClick = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      const stripe = await stripePromise;
      console.log("Button clicked");

      const response = await fetch(donationsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({ donation: { amount: amount } }), // Send the amount to the backend
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const session = await response.json();
      console.log("Received session ID:", session.id);

      // Redirects to the stripe checkout session
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setErrorMessages(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessages(error.message);
    }
  };
  

  

  return (
    <>
      <div className="black-strip"></div>
      <section className="page-section" id="register">
        <h2 className="text-center section-heading text-uppercase text-dark" style={{ fontSize: 32, marginTop: 80 }}>Support Our Mission to Make Classrooms More Inclusive</h2>
        <h3 className="text-center section-subheading" style={{ fontSize: 20 }}>Your donation helps provide free neurodiversity awareness kits to classrooms across the country.</h3>
        <div className="container mb-5 text-centered" style={{ width: 1000 }}>
          <p>When you donate to Project Aware, you're helping create inclusive learning environments for students everywhere. Every contribution, big or small, allows us to provide free classroom kits filled with books, lesson plans, and materials that encourage neurodiversity awareness.</p>
          <p>These resources help teachers foster understanding, empathy, and acceptance in their classrooms, ensuring that neurodivergent students feel supported and valued. Your support can make a lasting difference in the lives of both teachers and students.</p>
          <p>Together, we can build a future where every child's unique learning style is celebrated.</p>
        </div>
        <div className="container mt-5 p-5 rounded bg-light w-75" style={{
          boxShadow: '25px 25px 55px rgba(0, 0, 0, 0.5)',
          borderTop: '1.5px solid rgba(255, 255, 255, 0.5)',
          borderLeft: '1.5px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 className="text-center section-heading text-uppercase text-dark"> Make a Donation</h4>
          <p className="text-center text-muted">Select an amount or enter your own.</p>
          <div className={errorMessages ? "text-center text-danger text-bold mb-3" : "d-none"} id="submitErrorMessage">
            {errorMessages && <p>{errorMessages}</p>}
          </div>
          <form>
            <div className="d-flex justify-content-center form-group mt-5">
              <input
                type="number"
                value={amount}
                className="form-control"
                required
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <div className="btn-group">
                <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => handleAmountClick(10)}>
                  $10
                </button>
                <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => handleAmountClick(50)}>
                  $50
                </button>
                <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => handleAmountClick(100)}>
                  $100
                </button>
              </div>
              </div>
              <div className="text-center">
                <button role="link" className="btn btn-primary btn-lg text-uppercase mt-4 mb-3 shadow" onClick={handleClick}>Donate Now</button>
              </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Donation;