import React, { useState } from 'react';
import { colors } from '../../../styles/theme';
import './Auth.css';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 3) {
      setError('Password should be at least 3 characters');
      return;
    }
    
    onSignup({ email, password, name });
  };

  return (
    <div className="auth-container" style={{ backgroundColor: colors.primary }}>
      <div className="auth-header">
        <h1 style={{ color: colors.accent }}>Readify</h1>
        <p style={{ color: colors.lightText }}>Create an account to start tracking</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message" style={{color: '#ff3333'}}>{error}</div>}
        
        <div className="input-group">
          <label style={{ color: colors.text }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ borderColor: colors.border }}
            placeholder="Enter your name"
          />
        </div>
        
        <div className="input-group">
          <label style={{ color: colors.text }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderColor: colors.border }}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="input-group">
          <label style={{ color: colors.text }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderColor: colors.border }}
            placeholder="Create a password"
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          style={{ backgroundColor: colors.accent }}
        >
          Sign Up
        </button>
        
        <div className="auth-demo-hint">
          <p style={{ color: colors.lightText, fontSize: '14px' }}>
            For demo purposes, any credentials will work
          </p>
        </div>
      </form>
      
      <div className="auth-footer">
        <p style={{ color: colors.lightText }}>
          Already have an account?{' '}
          <span 
            className="auth-link" 
            onClick={onSwitchToLogin}
            style={{ color: colors.accent }}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;