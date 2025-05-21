import React from 'react';

function About() {
  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>About Event Registration</h1>
      <p>
        Welcome to our Event Registration system! This platform allows users to register for events easily and securely.
      </p>
      <h2>Key Features</h2>
      <ul>
        <li>Simple and intuitive event registration process.</li>
        <li>User and Admin roles with dedicated dashboards.</li>
        <li>View event details and registrations.</li>
        <li>Secure login and session management.</li>
        <li>Responsive design for desktop and mobile.</li>
      </ul>
      <h2>How It Works</h2>
      <p>
        Users can create accounts, log in, and register for upcoming events. Admins can manage events and view registrations.
        This system is built with React on the frontend and Flask with SQLite on the backend.
      </p>
      <h2>Contact</h2>
      <p>
        For any queries or support, please contact our support team at <a href="mailto:support@example.com">support@example.com</a>.
      </p>
    </div>
  );
}

export default About;
