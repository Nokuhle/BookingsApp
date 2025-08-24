import React, { useState } from 'react';
import { colors } from '../../../styles/theme';
import './Auth.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demo purposes, accept any non-empty credentials
    onLogin({ email, name: email.split('@')[0] });
  };

  return (
    <div className="auth-container" style={{ backgroundColor: colors.primary }}>
      <div className="auth-header">
        <h1 style={{ color: colors.accent }}>Readify</h1>
        <p style={{ color: colors.lightText }}>Log in to continue your reading journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message" style={{color: '#ff3333'}}>{error}</div>}
        
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
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          style={{ backgroundColor: colors.accent }}
        >
          Log In
        </button>
        
        <div className="auth-demo-hint">
          <p style={{ color: colors.lightText, fontSize: '14px' }}>
            For demo purposes, any email and password will work
          </p>
        </div>
      </form>
      
      <div className="auth-footer">
        <p style={{ color: colors.lightText }}>
          Don't have an account?{' '}
          <span 
            className="auth-link" 
            onClick={onSwitchToSignup}
            style={{ color: colors.accent }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;