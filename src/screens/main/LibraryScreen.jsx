import React from 'react';
import { colors } from '../../../styles/theme';
import BookGrid from '../../components/book/BookGrid';
import './MainScreens.css';

const LibraryScreen = ({ books, onBookSelect }) => {
  return (
    <div className="screen-container" style={{ backgroundColor: colors.background }}>
      <div className="screen-header">
        <h1 style={{ color: colors.text }}>My Library</h1>
        <p style={{ color: colors.lightText }}>{books.length} books logged</p>
      </div>
      
      {books.length > 0 ? (
        <BookGrid books={books} onBookSelect={onBookSelect} />
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