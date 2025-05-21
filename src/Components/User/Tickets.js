import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [viewTicket, setViewTicket] = useState(null); // for view modal

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);

    fetch('http://localhost:5000/user-tickets', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.tickets) setTickets(data.tickets);
        else alert(data.message || 'Failed to fetch tickets');
      })
      .catch(err => {
        alert('Error fetching tickets');
      });
  }, []);

  // PDF Download
  const downloadTicket = (ticket) => {
    if (!user) {
      alert('User info not available');
      return;
    }

    const doc = new jsPDF();

    const currentTime = new Date().toLocaleString(); // ✅ Current time

    doc.setFontSize(18);
    doc.text("Event Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Event: ${ticket.event_title}`, 20, 40);
    doc.text(`Name: ${user.name}`, 20, 50);
    doc.text(`Email: ${user.email}`, 20, 60);
    doc.text(`Ticket Code: ${ticket.ticket_code}`, 20, 70);
    doc.text(`Issued At: ${new Date(ticket.issued_at).toLocaleString()}`, 20, 80);
    doc.text(`Downloaded At: ${currentTime}`, 20, 90); // ✅ Added current time

    doc.save(`${ticket.event_title.replace(/\s/g, '_')}_ticket.pdf`);
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h1>My Tickets</h1>

      {tickets.length === 0 ? (
        <p>No tickets found. Register for an event first.</p>
      ) : (
        tickets.map(ticket => (
          <div key={ticket.ticket_code} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10, borderRadius: 6 }}>
            <h3>{ticket.event_title}</h3>
            <p><b>Ticket Code:</b> {ticket.ticket_code}</p>
            <p><b>Issued At:</b> {new Date(ticket.issued_at).toLocaleString()}</p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setViewTicket(ticket)} style={{
                padding: '6px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer'
              }}>
                View Ticket
              </button>

              <button onClick={() => downloadTicket(ticket)} style={{
                padding: '6px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer'
              }}>
                Download PDF
              </button>
            </div>
          </div>
        ))
      )}

      {/* Ticket View Modal */}
      {viewTicket && user && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff', padding: 20, borderRadius: 10, width: 400
          }}>
            <h2>Ticket Preview</h2>
            <p><b>Event:</b> {viewTicket.event_title}</p>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Ticket Code:</b> {viewTicket.ticket_code}</p>
            <p><b>Issued At:</b> {new Date(viewTicket.issued_at).toLocaleString()}</p>

            <button onClick={() => setViewTicket(null)} style={{
              marginTop: 10, padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff',
              border: 'none', borderRadius: 4, cursor: 'pointer'
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTickets;
