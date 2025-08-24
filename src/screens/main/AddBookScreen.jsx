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
  const [isSaving, setIsSaving] = useState(false);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setStep('mood');
  };

  const handleMoodSubmit = async (moodData) => {
    if (!user || !user.uid) {
      console.error("No user logged in");
      alert("Please log in to save books");
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare book data for Firestore
      const bookData = {
        ...selectedBook,
        ...moodData,
        userId: user.uid,
        dateAdded: serverTimestamp()
      };

      console.log("Saving book to Firestore:", bookData);
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "userBooks"), bookData);
      
      console.log("Book saved with ID: ", docRef.id);
      
      // Update local state with the new book (including Firestore ID)
      const bookWithId = {
        ...bookData,
        id: docRef.id
      };
      
      onAddBook(bookWithId);
      
      setSelectedBook(null);
      setStep('search');
    } catch (error) {
      console.error("Error adding book to Firestore: ", error);
      alert("Error saving book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedBook(null);
    setStep('search');
  };

  return (
    <div className="screen-container" style={{ backgroundColor: colors.background }}>
      <div className="screen-header">
        <h1 style={{ color: colors.text }}>
          {step === 'search' ? 'Add a Book' : 'Capture the Vibe'}
        </h1>
        {step === 'mood' && (
          <button 
            onClick={handleCancel}
            style={{
              backgroundColor: colors.secondary,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Cancel
          </button>
        )}
      </div>
      
      {step === 'search' ? (
        <BookSearch onBookSelect={handleBookSelect} />
      ) : (
        <MoodForm 
          book={selectedBook} 
          onSubmit={handleMoodSubmit} 
          isSubmitting={isSaving}
        />
      )}
    </div>
  );
};

export default AddBookScreen;