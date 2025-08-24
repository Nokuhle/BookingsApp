import React from 'react';
import { colors } from '../../../styles/theme';
import './BookComponents.css';

const BookGrid = ({ books, onBookSelect }) => {
  return (
    <div className="book-grid">
      {books.map(book => (
        <div 
          key={book.id} 
          className="book-card"
          onClick={() => onBookSelect(book)}
          style={{ borderColor: book.moodColor || colors.border }}
        >
          <div className="book-cover">
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} />
            ) : (
              <div className="book-cover-placeholder">
                {book.title.charAt(0)}
              </div>
            )}
            {book.moodColor && (
              <div 
                className="mood-indicator" 
                style={{ backgroundColor: book.moodColor }}
              ></div>
            )}
          </div>
          <div className="book-info">
            <h3 className="book-title" style={{ color: colors.text }}>
              {book.title}
            </h3>
            <p className="book-author" style={{ color: colors.lightText }}>
              {book.author}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;