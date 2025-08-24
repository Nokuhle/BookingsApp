import React from 'react';
import { colors } from '../../../styles/theme';
import { useApp } from '../../context/AppContext'; // Import the context
import BookGrid from '../../components/book/BookGrid';
import './MainScreens.css';

const LibraryScreen = ({ onBookSelect }) => {
  const { user, books } = useApp(); // Get both user and books from context
  
  console.log("Current user:", user);
  console.log("All books from context:", books);
  
  // Filter books by current user
  const userBooks = books.filter(book => book.userId === user?.uid);
  console.log("Filtered user books:", userBooks);

  return (
    <div className="screen-container" style={{ backgroundColor: colors.background }}>
      <div className="screen-header">
        <h1 style={{ color: colors.text }}>My Library</h1>
        <p style={{ color: colors.lightText }}>{userBooks.length} books logged</p>
      </div>
      
      {userBooks.length > 0 ? (
        <BookGrid books={userBooks} onBookSelect={onBookSelect} />
      ) : (
        <div className="empty-state">
          <div className="empty-icon" style={{ color: colors.secondary }}>
            📚
          </div>
          <h3 style={{ color: colors.text }}>Your library is empty</h3>
          <p style={{ color: colors.lightText }}>
            Add books to start tracking your reading journey
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryScreen;