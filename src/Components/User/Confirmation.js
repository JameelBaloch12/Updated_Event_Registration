// Confirmation.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const { name, email, eventName } = location.state || {};

  useEffect(() => {
    if (!email || !eventName) {
      alert('Missing registration data');
      navigate('/');
      return;
    }

    const register = async () => {
      try {
        const res = await fetch('http://localhost:5000/event-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            event_id: eventName.replace(/\s+/g, '_').toLowerCase(), // use title as ID
            event_title: eventName
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to register');
        setResult(data);
      } catch (err) {
        alert(err.message);
        navigate('/');
      }
    };

    register();
  }, [email, eventName, navigate]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Event Registration Confirmation</h1>
      {result ? (
        <div style={{ marginTop: 20 }}>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {result.email}</p>
          <p><strong>Event:</strong> {eventName}</p>
          <p><strong>Ticket ID:</strong> {result.ticket_code}</p>
          <p><strong>Registered At:</strong> {result.timestamp}</p>
        </div>
      ) : (
        <p>Registering for event...</p>
      )}
    </div>
  );
}

export default Confirmation;
