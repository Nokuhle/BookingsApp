import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  books: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_BOOK':
      const newBooks = [...state.books, { ...action.payload, id: Date.now().toString() }];
      localStorage.setItem('readify_books', JSON.stringify(newBooks));
      return { ...state, books: newBooks };
    case 'LOAD_BOOKS':
      return { ...state, books: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem('readify_books') || '[]');
    const savedUser = JSON.parse(localStorage.getItem('readify_user') || 'null');
    
    dispatch({ type: 'LOAD_BOOKS', payload: savedBooks });
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: savedUser });
    }
  }, []);

  const value = {
    ...state,
    setUser: (user) => {
      localStorage.setItem('readify_user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    },
    addBook: (book) => {
      dispatch({ type: 'ADD_BOOK', payload: book });
    },
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}