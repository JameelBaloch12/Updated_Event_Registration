import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EventRegistration = () => {
  const { eventId } = useParams(); // eventId route se milega
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const registerForEvent = async () => {
      try {
        const response = await fetch('http://localhost:5000/event-register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 🧠 Required to send session cookie
          body: JSON.stringify({
            event_id: eventId,
            event_title: 'Sample Event' // Replace with actual title if available
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setTicket({
            ticketCode: data.ticket_code,
            eventId: eventId,
            time: new Date().toLocaleString(),
          });
        } else {
          setError(data.message || 'Event registration failed');
        }
      } catch (err) {
        console.error(err);
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    registerForEvent();
  }, [eventId]);

  const handlePrint = () => {
    if (!ticket) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Event Ticket</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; background: #f0f9ff; }
            .ticket { border: 1px solid #ccc; padding: 1rem; background: white; border-radius: 10px; max-width: 500px; margin: auto; }
            h2 { color: #2563eb; }
            p { margin: 0.5rem 0; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h2>🎟️ Event Ticket</h2>
            <p><strong>Ticket ID:</strong> ${ticket.ticketCode}</p>
            <p><strong>Event ID:</strong> ${ticket.eventId}</p>
            <p><strong>Issued At:</strong> ${ticket.time}</p>
          </div>
          <script>window.onload = () => setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) return <p>Registering for event...</p>;

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#f0f9ff',
      borderRadius: '12px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <h2 style={{ color: '#2563eb', textAlign: 'center' }}>🎉 Registration Result</h2>

      {error ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
      ) : (
        ticket && (
          <>
            <p><strong>Ticket ID:</strong> {ticket.ticketCode}</p>
            <p><strong>Event ID:</strong> {ticket.eventId}</p>
            <p><strong>Issued At:</strong> {ticket.time}</p>

            <button
              onClick={handlePrint}
              style={{
                marginTop: '1.5rem',
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Open & Print Ticket
            </button>
          </>
        )
      )}
    </div>
  );
};

export default EventRegistration;
