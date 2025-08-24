import React from 'react';
import { colors } from '../../../styles/theme';
import './MainScreens.css';

const StatsScreen = ({ books }) => {
  const totalBooks = books.length;
  const moods = books.reduce((acc, book) => {
    acc[book.mood] = (acc[book.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="screen-container" style={{ backgroundColor: colors.background }}>
      <div className="screen-header">
        <h1 style={{ color: colors.text }}>Reading Stats</h1>
        <p style={{ color: colors.lightText }}>Overview of your reading journey</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card" style={{ backgroundColor: colors.primary }}>
          <div className="stat-number" style={{ color: colors.accent }}>
            {totalBooks}
          </div>
          <div className="stat-label" style={{ color: colors.text }}>
            Books Read
          </div>
        </div>
        
        <div className="stat-card" style={{ backgroundColor: colors.primary }}>
          <div className="stat-number" style={{ color: colors.accent }}>
            {Object.keys(moods).length}
          </div>
          <div className="stat-label" style={{ color: colors.text }}>
            Different Moods
          </div>
        </div>
      </div>
      
      <div className="mood-breakdown">
        <h3 style={{ color: colors.text }}>Mood Breakdown</h3>
        {Object.entries(moods).map(([mood, count]) => (
          <div key={mood} className="mood-item">
            <div className="mood-color" style={{ backgroundColor: mood }}></div>
            <span className="mood-name" style={{ color: colors.text }}>
              {mood}
            </span>
            <span className="mood-count" style={{ color: colors.lightText }}>
              {count} {count === 1 ? 'book' : 'books'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsScreen;