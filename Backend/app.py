from flask import Flask, request, jsonify, session
from flask_cors import CORS
from extensions import db
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Session ke liye zaroori

# CORS setup (cookies ke saath)
CORS(app, supports_credentials=True)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    from models import User, Admin, EventRegistration, Ticket
    db.create_all()

@app.route('/')
def home():
    return "Flask backend is running!"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if not all([name, email, password]):
        return jsonify({'message': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    if role == 'admin':
        new_user = Admin(name=name, email=email, role='admin')
    else:
        new_user = User(name=name, email=email, role='user')

    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': f'User {email} registered successfully!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        session['email'] = user.email
        session['role'] = user.role

        return jsonify({
            'message': 'Login successful',
            'dashboard': 'admin' if user.role == 'admin' else 'user',
            'user': {
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        })

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/event-register', methods=['POST'])
def event_register():
    email = session.get('email')
    if not email:
        return jsonify({'message': 'Please log in to register for an event'}), 401

    data = request.get_json()
    event_id = data.get('event_id')
    event_title = data.get('event_title')

    if not all([event_id, event_title]):
        return jsonify({'message': 'Missing event details'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Check if already registered
    existing = EventRegistration.query.filter_by(user_id=user.id, event_id=event_id).first()
    if existing:
        return jsonify({'message': 'Already registered for this event'}), 400

    registration = EventRegistration(user_id=user.id, event_id=event_id, event_title=event_title)
    db.session.add(registration)

    # Create ticket with unique code
    ticket_code = str(uuid.uuid4())[:8]
    ticket = Ticket(user_id=user.id, event_id=event_id, event_title=event_title, ticket_code=ticket_code)
    db.session.add(ticket)

    db.session.commit()

    return jsonify({
        'message': 'Event registered successfully',
        'ticket_code': ticket_code,
        'event_title': event_title,
        'registered_at': registration.registration_date.isoformat()
    })

@app.route('/user-tickets', methods=['GET'])
def user_tickets():
    email = session.get('email')
    if not email:
        return jsonify({'message': 'Please log in first'}), 401

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    tickets = Ticket.query.filter_by(user_id=user.id).all()
    tickets_data = []
    for t in tickets:
        tickets_data.append({
            'ticket_code': t.ticket_code,
            'event_id': t.event_id,
            'event_title': t.event_title,
            'issued_at': t.issued_at.isoformat()
        })

    return jsonify({'tickets': tickets_data})

if __name__ == '__main__':
    app.run(debug=True)
    
    