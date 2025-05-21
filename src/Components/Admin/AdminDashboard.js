import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin-registrations')
      .then(res => res.json())
      .then(data => setRegistrations(data))
      .catch(err => console.error('Error fetching registrations:', err));
  }, []);

  return (
    <div style={{ padding: '30px', maxWidth: 1000, margin: '0 auto' }}>
      <h1>📋 All Registered Events</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Event</th>
            <th style={thStyle}>Ticket Code</th>
            <th style={thStyle}>Registered At</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{reg.user_name}</td>
              <td style={tdStyle}>{reg.user_email}</td>
              <td style={tdStyle}>{reg.event_title}</td>
              <td style={tdStyle}>{reg.ticket_code}</td>
              <td style={tdStyle}>{reg.registered_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd'
};

export default AdminDashboard;
