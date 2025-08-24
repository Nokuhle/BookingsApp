import React, { useState } from 'react';
import { colors } from '../../../styles/theme';
import BookSearch from '../../components/book/BookSearch';
import MoodForm from '../../components/book/MoodForm';
import './MainScreens.css';

const AddBookScreen = ({ onAddBook }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [step, setStep] = useState('search');

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setStep('mood');
  };

  const handleMoodSubmit = (moodData) => {
    onAddBook({
      ...selectedBook,
      ...moodData
    });
    setSelectedBook(null);
    setStep('search');
  };

  return (
    <div className="screen-container" style={{ backgroundColor: colors.background }}>
      <div className="screen-header">
        <h1 style={{ color: colors.text }}>
          {step === 'search' ? 'Add a Book' : 'Capture the Vibe'}
        </h1>
      </div>
      
      {step === 'search' ? (
        <BookSearch onBookSelect={handleBookSelect} />
      ) : (
        <MoodForm book={selectedBook} onSubmit={handleMoodSubmit} />
      )}
    </div>
  );
};

export default AddBookScreen;