import React, { useState, useEffect, useCallback } from 'react';
import { colors } from '../../../styles/theme';
import { searchBooks, searchBooksBySubject, getPopularSubjects } from '../../../services/bookAPI';
import './BookComponents.css';

const BookSearch = ({ onBookSelect }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // Automatic search when query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [debouncedQuery, searchType, subjectOptions.exclude]);

  const performSearch = useCallback(async () => {
    if (!debouncedQuery.trim()) return;
    
    setIsLoading(true);
    try {
      let books;
      
      if (searchType === 'subject' || searchType === 'subject_key') {
        books = await searchBooksBySubject(debouncedQuery, {
          exactMatch: searchType === 'subject_key',
          excludeSubjects: subjectOptions.exclude ? subjectOptions.exclude.split(',').map(s => s.trim()).filter(s => s) : []
        });
      } else {
        books = await searchBooks(debouncedQuery, searchType);
      }
      
      setResults(books);
    } catch (error) {
      console.error('Search error:', error);
      // Don't show alert for automatic searches
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, searchType, subjectOptions.exclude]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    performSearch();
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setResults([]);
    setShowAdvanced(type === 'subject' || type === 'subject_key');
  };

  const loadPopularSubjects = async () => {
    try {
      const subjects = await getPopularSubjects(12);
      setSubjectOptions(prev => ({
        ...prev,
        popular: subjects
      }));
    } catch (error) {
      console.error('Error loading popular subjects:', error);
    }
  };

  const handleSubjectOptionChange = (option, value) => {
    setSubjectOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSubjectOptions({});
  };

  return (
    <div className="book-search">
      <div className="search-type-selector">
        <button
          type="button"
          className={`search-type-btn ${searchType === 'title' ? 'active' : ''}`}
          onClick={() => handleSearchTypeChange('title')}
          style={{
            backgroundColor: searchType === 'title' ? colors.accent : colors.primary,
            color: 'black'
          }}
        >
          📖 Title/Author
        </button>
        <button
          type="button"
          className={`search-type-btn ${searchType === 'subject' ? 'active' : ''}`}
          onClick={() => handleSearchTypeChange('subject')}
          style={{
            backgroundColor: searchType === 'subject' ? colors.accent : colors.primary,
            color: 'black'
          }}
        >
          🏷️ Genre
        </button>
        <button
          type="button"
          className={`search-type-btn ${searchType === 'subject_key' ? 'active' : ''}`}
          onClick={() => handleSearchTypeChange('subject_key')}
          style={{
            backgroundColor: searchType === 'subject_key' ? colors.accent : colors.primary,
            color: 'black'
          }}
        >
          🔍 Exact Subject
        </button>
      </div>

      {showAdvanced && (
        <div className="subject-options">
          <div className="option-group">
            <label>Exclude subjects (comma-separated):</label>
            <input
              type="text"
              placeholder="python, fiction, romance, etc."
              value={subjectOptions.exclude || ''}
              onChange={(e) => handleSubjectOptionChange('exclude', e.target.value)}
            />
          </div>
          
          <div className="popular-subjects">
            <button type="button" onClick={loadPopularSubjects}>
              📊 Show Popular Subjects
            </button>
            {subjectOptions.popular && (
              <div className="subject-tags">
                {subjectOptions.popular.map(subject => (
                  <span
                    key={subject.key}
                    className="subject-tag"
                    onClick={() => setQuery(subject.name)}
                  >
                    {subject.name} ({subject.count})
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchType === 'title' 
                ? "🔍 Search for books by title or author..."
                : searchType === 'subject'
                ? "🏷️ Search for books by subject (e.g., fantasy, science)..."
                : "🔍 Search for exact subject match (e.g., fantasy_fiction)..."
            }
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                backgroundColor: colors.secondary,
                padding: '10px',
                borderRadius: '50%',
                minWidth: 'auto'
              }}
            >
              ✕
            </button>
          )}
          <button 
            type="submit"
            style={{ backgroundColor: colors.accent }}
          >
            Search
          </button>
        </div>
      </form>
      
      {isLoading ? (
        <div className="loading">
          <div>🔍 Searching {searchType === 'title' ? 'books' : 'subjects'}...</div>
          <div style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
            Looking for "{debouncedQuery}"
          </div>
        </div>
      ) : (
        <div className="search-results">
          {results.map(book => (
            <div 
              key={book.id} 
              className="search-result-item"
              onClick={() => onBookSelect(book)}
            >
              <div className="result-book-cover">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} />
                ) : (
                  <div className="result-cover-placeholder">
                    {book.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="result-book-info">
                <h4 style={{ color: colors.text }}>{book.title}</h4>
                <p style={{ color: colors.lightText }}>{book.author}</p>
                {book.subjects && book.subjects.length > 0 && (
                  <div className="book-subjects">
                    <span>
                      📚 {book.subjects.slice(0, 3).join(', ')}
                      {book.subjects.length > 3 && '...'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {results.length === 0 && debouncedQuery && !isLoading && (
            <div className="no-results">
              <p>No books found for "{debouncedQuery}"</p>
              <p style={{ fontSize: '14px', marginTop: '8px', color: '#999' }}>
                Try a different search term or check your spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSearch;