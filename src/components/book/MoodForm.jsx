import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { colors } from '../../../styles/theme';
import './BookComponents.css';

const MoodForm = ({ book, onSubmit }) => {
  const [moodColor, setMoodColor] = useState('#FFB6C1');
  const [emotions, setEmotions] = useState([]);
  const [notes, setNotes] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const emotionOptions = ['Happy', 'Sad', 'Inspired', 'Thoughtful', 'Excited', 'Nostalgic', 'Relaxed', 'Motivated'];

  const toggleEmotion = (emotion) => {
    if (emotions.includes(emotion)) {
      setEmotions(emotions.filter(e => e !== emotion));
    } else {
      setEmotions([...emotions, emotion]);
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  onSubmit({
    moodColor,
    emotions,
    notes,
    dateAdded: new Date().toISOString()
  });
};

  return (
    <div className="mood-form">
      <div className="selected-book">
        <div className="selected-book-cover">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} />
          ) : (
            <div className="selected-cover-placeholder">
              {book.title.charAt(0)}
            </div>
          )}
        </div>
        <div className="selected-book-info">
          <h3 style={{ color: colors.text }}>{book.title}</h3>
          <p style={{ color: colors.lightText }}>{book.author}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ color: colors.text }}>Book Vibe Color</label>
          <div 
            className="color-picker-toggle"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{ backgroundColor: moodColor }}
          ></div>
          {showColorPicker && (
            <div className="color-picker-popover">
              <div 
                className="color-picker-cover"
                onClick={() => setShowColorPicker(false)}
              />
              <ChromePicker 
                color={moodColor} 
                onChangeComplete={(color) => setMoodColor(color.hex)}
              />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label style={{ color: colors.text }}>Emotions</label>
          <div className="emotion-tags">
            {emotionOptions.map(emotion => (
              <span
                key={emotion}
                className={`emotion-tag ${emotions.includes(emotion) ? 'selected' : ''}`}
                onClick={() => toggleEmotion(emotion)}
                style={{ 
                  backgroundColor: emotions.includes(emotion) ? moodColor : '#f0f0f0',
                  color: emotions.includes(emotion) ? 'white' : colors.text
                }}
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label style={{ color: colors.text }}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did this book make you feel? What stood out to you?"
            style={{ borderColor: colors.border }}
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="mood-submit-button"
          style={{ backgroundColor: colors.accent }}
        >
          Save Book & Mood
        </button>
      </form>
    </div>
  );
};

export default MoodForm;