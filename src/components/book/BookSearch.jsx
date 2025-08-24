import React, { useState } from 'react';
import { colors } from '../../../styles/theme';
import { searchBooks } from '../../../services/bookAPI';
import './BookComponents.css';

const BookSearch = ({ onBookSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const books = await searchBooks(query);
      setResults(books);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="book-search">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a book by title or author..."
            style={{ borderColor: colors.border }}
          />
          <button 
            type="submit"
            style={{ backgroundColor: colors.accent }}
          >
            Search
          </button>
        </div>
      </form>
      
      {isLoading ? (
        <div className="loading">Searching...</div>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookSearch;