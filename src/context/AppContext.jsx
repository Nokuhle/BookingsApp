import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const AppContext = createContext();

const initialState = {
  user: null,
  books: [],
  isLoading: true
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };
    case 'SET_BOOKS':
      return { ...state, books: action.payload, isLoading: false };
    case 'ADD_BOOK':
      const newBooks = [action.payload, ...state.books];
      return { ...state, books: newBooks };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null, books: [] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Listen for auth state changes
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("User authenticated:", firebaseUser.uid);
        dispatch({ type: 'SET_USER', payload: firebaseUser });
      } else {
        console.log("No user authenticated");
        dispatch({ type: 'CLEAR_USER' });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Subscribe to user's books when user changes
  useEffect(() => {
    let unsubscribeBooks = null;
    
    if (state.user && state.user.uid) {
      console.log("Setting up Firestore listener for user:", state.user.uid);
      
      try {
        const booksQuery = query(
          collection(db, "userBooks"),
          where("userId", "==", state.user.uid)
        );
        
        unsubscribeBooks = onSnapshot(booksQuery, 
          (querySnapshot) => {
            console.log("Firestore snapshot received");
            
            const books = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const bookData = {
                id: doc.id,
                ...data,
                dateAdded: data.dateAdded?.toDate?.() || data.dateAdded
              };
              books.push(bookData);
            });
            
            // Sort locally by dateAdded descending
            books.sort((a, b) => {
              const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
              const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
              return dateB - dateA;
            });
            
            console.log("Processed books:", books.length);
            dispatch({ type: 'SET_BOOKS', payload: books });
          },
          (error) => {
            console.error("Error fetching books from Firestore:", error);
          }
        );
      } catch (error) {
        console.error("Error setting up Firestore query:", error);
      }
    } else {
      console.log("No user found, clearing books");
      dispatch({ type: 'SET_BOOKS', payload: [] });
    }
    
    // Cleanup subscription on unmount or user change
    return () => {
      if (unsubscribeBooks) {
        console.log("Unsubscribing from Firestore listener");
        unsubscribeBooks();
      }
    };
  }, [state.user]);

  const value = {
    ...state,
    addBook: (book) => {
      console.log("Adding book to context:", book);
      dispatch({ type: 'ADD_BOOK', payload: book });
    },
    logout: async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        console.log("User logged out successfully");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
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