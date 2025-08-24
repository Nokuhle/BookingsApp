import React, { useState } from 'react';
import { colors } from '../../../styles/theme';
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import './Auth.css';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      
      // Prepare user data for Firestore collection "userstwo"
      const userData = {
        name: name,
        email: email,
        createdAt: new Date()
      };
      
      // Store user data in Firestore with the user's UID as document ID
      await setDoc(doc(db, "userstwo", user.uid), userData);
      
      // Update user context
      onSignup({ 
        uid: user.uid, 
        email: user.email, 
        name: name
      });
      
    } catch (error) {
      console.error("Error signing up:", error);
      
      // Handle specific Firebase errors
      let errorMessage = "An error occurred during signup. Please try again.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please use a different email or sign in.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
          break;
        case 'auth/weak-password':
          errorMessage = "The password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    }
    
    setIsLoading(false);
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            placeholder="Create a password (min. 6 characters)"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          style={{ backgroundColor: colors.accent }}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
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