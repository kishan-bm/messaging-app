import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Auth.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize the hook

  const handleStep1 = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (otp !== '1234') {
      setError('Invalid OTP. Please try again.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleStep3 = async (e) => {
  e.preventDefault();
  setError('');
  const success = await register(username || phoneNumber, phoneNumber, password);
  if (success) {
    navigate('/login');
  } else {
    setError('Registration failed. Username may already exist.');
  }
}; 

  const renderStep = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleStep1}>
          <input
            type="tel"
            placeholder="Phone Number (10 digits)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.slice(0, 10))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      );
    } else if (step === 2) {
      return (
        <form onSubmit={handleStep2}>
          <p>Enter the 4-digit OTP sent to your phone number.</p>
          <div className="otp-container">
            {Array.from({ length: 4 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={otp[index] || ''}
                onChange={(e) => {
                  const newOtp = otp.split('');
                  newOtp[index] = e.target.value;
                  setOtp(newOtp.join(''));
                }}
                required
                style={{ width: '40px', textAlign: 'center' }}
              />
            ))}
          </div>
          <button type="submit">Verify & Continue</button>
        </form>
      );
    } else if (step === 3) {
      return (
        <form onSubmit={handleStep3}>
          <input
            type="text"
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Relatim Register</h2>
        {renderStep()}
        {error && <p className="auth-error">{error}</p>}
        <p className="auth-link">Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};

export default RegisterPage;