import React from 'react';
import { colors } from '../../../styles/theme';
import './BottomTabs.css';

const BottomTabs = ({ activeTab, onTabChange, onLogout }) => {
  const tabs = [
    { id: 'library', label: 'My Library', icon: '📚' },
    { id: 'add', label: 'Add Book', icon: '➕' },
    { id: 'stats', label: 'Stats', icon: '📊' },
  ];

  return (
    <div className="bottom-tabs-container">
      <div className="bottom-tabs" style={{ backgroundColor: colors.primary }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="tab-icon">{tab.icon}</div>
            <div 
              className="tab-label" 
              style={{ color: activeTab === tab.id ? colors.accent : colors.lightText }}
            >
              {tab.label}
            </div>
          </div>
        ))}
      </div>
      <div className="logout-button">
        <button onClick={onLogout} style={{ backgroundColor: colors.secondary }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default BottomTabs;