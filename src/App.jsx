import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '../src/context/AppContext.jsx';
import Login from './screens/auth/Login.jsx';
import Signup from './screens/auth/Signup.jsx';
import LibraryScreen from './screens/main/LibraryScreen.jsx';
import AddBookScreen from './screens/main/AddBookScreen.jsx';
import StatsScreen from './screens/main/StatsScreen.jsx';
import BottomTabs from './components/common/BottomTabs.jsx';
import './App.css';

function AppContent() {
  const { user, books, addBook, logout } = useApp(); // Add logout from context
  const [activeTab, setActiveTab] = useState('library');
  const [authMode, setAuthMode] = useState('login');

  // Add this useEffect to debug
  useEffect(() => {
    console.log('AppContent rendered', { user, authMode });
  }, [user, authMode]);

  const handleLogin = (userData) => {
    console.log('Logging in with:', userData);
    // setUser is no longer needed as auth is handled by Firebase Auth listener
  };

  const handleSignup = (userData) => {
    console.log('Signing up with:', userData);
    // setUser is no longer needed as auth is handled by Firebase Auth listener
  };

  const handleLogout = async () => {
    console.log('Logging out');
    await logout(); // Use the logout function from context
    setAuthMode('login');
  };

  // If user is not logged in, show authentication screens
  if (!user) {
    console.log('No user, showing auth screen:', authMode);
    return authMode === 'login' ? (
      <Login 
        onLogin={handleLogin} 
        onSwitchToSignup={() => setAuthMode('signup')} 
      />
    ) : (
      <Signup 
        onSignup={handleSignup} 
        onSwitchToLogin={() => setAuthMode('login')} 
      />
    );
  }

  console.log('User exists, showing main app:', user);

  // If user is logged in, show the main app with bottom tabs
  const renderScreen = () => {
    switch (activeTab) {
      case 'library':
        return <LibraryScreen onBookSelect={() => {}} />; // Remove books prop
      case 'add':
        return <AddBookScreen onAddBook={addBook} />;
      case 'stats':
        return <StatsScreen />; // Remove books prop
      default:
        return <LibraryScreen onBookSelect={() => {}} />; // Remove books prop
    }
  };

  return (
    <div className="app">
      {renderScreen()}
      <BottomTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout}
      />
    </div>
  );
}

function App() {
  console.log('App component rendered');
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;