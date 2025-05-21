import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';
function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
    const payload = isLogin ? { email, password } : { name, email, password, role: 'user' };

    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          // Save user info locally and navigate
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        } else {
          alert('Registration successful! Please login now.');
          setIsLogin(true);
          setName('');
          setEmail('');
          setPassword('');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Something went wrong, please try again later.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ padding: '10px 15px', width: '100%' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: 15, cursor: 'pointer', color: 'blue' }} onClick={toggleMode}>
        {isLogin ? 'New user? Register here.' : 'Already have an account? Login here.'}
      </p>
    </div>
  );
}

export default LoginRegister;
