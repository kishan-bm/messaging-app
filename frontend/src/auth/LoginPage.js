import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Updated state variable
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(identifier, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username/phone number or password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Relatim Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Phone Number" // Updated placeholder
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        <p className="auth-link">Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default LoginPage;