import React, { useState } from 'react';
import { colors } from '../../../styles/theme';
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import './Auth.css';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firestore collection "userstwo"
      const userDoc = await getDoc(doc(db, "userstwo", user.uid));
      if (userDoc.exists()) {
        const userData = { uid: user.uid, ...userDoc.data() };
        onLogin(userData);
      } else {
        // If user doesn't exist in userstwo, create basic user data
        onLogin({ 
          uid: user.uid, 
          email: user.email, 
          name: email.split('@')[0] 
        });
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      
      // Handle specific Firebase errors
      let errorMessage = "An error occurred during login. Please try again.";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/user-disabled':
          errorMessage = "This account has been disabled.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
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
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          style={{ backgroundColor: colors.accent }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
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