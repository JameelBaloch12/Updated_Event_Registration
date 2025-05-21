import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import event1 from '../Assets/event1.jpg';
import event2 from '../Assets/event2.jpg';
import event3 from '../Assets/event3.jpg';
import event4 from '../Assets/event4.jpg';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const events = [
    { id: 1, title: 'Tech Conference 2025', description: 'Join us for the latest in tech and innovation.', image: event1 },
    { id: 2, title: 'Art Expo', description: 'Explore creativity and visual arts.', image: event2 },
    { id: 3, title: 'Health & Wellness Fair', description: 'Promoting healthy lifestyle and awareness.', image: event3 },
    { id: 4, title: 'Startup Meetup', description: 'Network with entrepreneurs and investors.', image: event4 },
  ];

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  const handleRegister = async (event) => {
    if (!user) {
      alert('Please login first.');
      return;
    }

    const res = await fetch('http://localhost:5000/event-register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: event.id, event_title: event.title }),
    });

    const data = await res.json();

    if (res.ok) {
      navigate('/tickets', {
        state: {
          userName: user.name,
          userEmail: user.email,
          eventTitle: data.event_title,
          ticketCode: data.ticket_code,
          registeredAt: data.registered_at,
        },
      });
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: 20 }}>
      <h1>Welcome {user ? user.name : 'Guest'} to Our Event Registration System</h1>

      {/* Info message with marquee */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 18, fontWeight: '500', color: '#444' }}>
            Discover and register for exciting upcoming events! Don’t miss the opportunity to learn, connect, and grow with like-minded people across various fields.
          </p>
        </div>
        <div style={{ flex: 1, marginLeft: 20 }}>
          <marquee behavior="scroll" direction="left" scrollamount="5">
            <img src={event1} alt="Event 1" style={{ height: 100, marginRight: 20 }} />
            <img src={event2} alt="Event 2" style={{ height: 100, marginRight: 20 }} />
            <img src={event3} alt="Event 3" style={{ height: 100, marginRight: 20 }} />
            <img src={event4} alt="Event 4" style={{ height: 100, marginRight: 20 }} />
          </marquee>
        </div>
      </div>

      {/* Upcoming Events Message */}
      <h2 style={{ marginTop: 40, color: '#333' }}>📅 Upcoming Events</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 20,
        marginTop: 20
      }}>
        {events.map((event) => (
          <div key={event.id} style={{
            border: '1px solid #ccc',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
          }}>
            <img src={event.image} alt={event.title} style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover'
            }} />
            <div style={{ padding: 15 }}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <button style={buttonStyle} onClick={() => handleRegister(event)}>Register</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '8px 12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Home;
