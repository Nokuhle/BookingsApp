import React, { useState } from 'react';
import { colors } from '../../../styles/theme';
import BookSearch from '../../components/book/BookSearch';
import MoodForm from '../../components/book/MoodForm';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useApp } from '../../context/AppContext';
import './MainScreens.css';

const AddBookScreen = ({ onAddBook }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [step, setStep] = useState('search');
  const { user } = useApp();

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setStep('mood');
  };

  const handleMoodSubmit = async (moodData) => {
    try {
      // Prepare book data for Firestore
      const bookData = {
        ...selectedBook,
        ...moodData,
        userId: user.uid,
        dateAdded: serverTimestamp()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "userBooks"), bookData);
      
      console.log("Book saved with ID: ", docRef.id);
      
      // Update local state
      onAddBook({
        ...bookData,
        id: docRef.id // Add the Firestore document ID
      });
      
      setSelectedBook(null);
      setStep('search');
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Error saving book. Please try again.");
    }
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