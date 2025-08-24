import axios from 'axios';

const OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';

export const searchBooks = async (query) => {
  try {
    const response = await axios.get(OPEN_LIBRARY_API, {
      params: {
        q: query,
        limit: 10,
        fields: 'key,title,author_name,cover_i,first_publish_year,edition_count,isbn,language'
      }
    });
    
    return response.data.docs.map(book => {
      // Get the cover image URL if available
      let coverUrl = null;
      if (book.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      }
      
      return {
        id: book.key,
        title: book.title || 'Unknown Title',
        author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
        coverUrl: coverUrl,
        publishedYear: book.first_publish_year,
        editionCount: book.edition_count,
        isbn: book.isbn ? book.isbn[0] : null,
        language: book.language ? book.language[0] : 'en'
      };
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

// Additional function to get book details by Open Library ID
export const getBookDetails = async (bookId) => {
  try {
    // Remove the /works/ prefix if present
    const cleanId = bookId.replace('/works/', '');
    const response = await axios.get(`https://openlibrary.org/works/${cleanId}.json`);
    
    const bookData = response.data;
    
    // Get description - it can be in different formats
    let description = 'No description available';
    if (bookData.description) {
      if (typeof bookData.description === 'string') {
        description = bookData.description;
      } else if (bookData.description.value) {
        description = bookData.description.value;
      }
    }
    
    // Get cover image
    let coverUrl = null;
    if (bookData.covers && bookData.covers.length > 0) {
      coverUrl = `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-M.jpg`;
    }
    
    return {
      id: bookId,
      title: bookData.title || 'Unknown Title',
      description: description,
      coverUrl: coverUrl,
      publishedDate: bookData.first_publish_date,
      subjects: bookData.subjects || []
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

// Function to search by specific fields (title, author, etc.)
export const searchBooksByField = async (field, query) => {
  try {
    const params = {};
    params[field] = query;
    
    const response = await axios.get(OPEN_LIBRARY_API, {
      params: {
        ...params,
        limit: 10,
        fields: 'key,title,author_name,cover_i,first_publish_year,edition_count,isbn'
      }
    });
    
    return response.data.docs.map(book => {
      let coverUrl = null;
      if (book.cover_i) {
        coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      }
      
      return {
        id: book.key,
        title: book.title || 'Unknown Title',
        author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
        coverUrl: coverUrl,
        publishedYear: book.first_publish_year,
        editionCount: book.edition_count,
        isbn: book.isbn ? book.isbn[0] : null
      };
    });
  } catch (error) {
    console.error(`Error searching books by ${field}:`, error);
    return [];
  }
};

// Specific search functions
export const searchBooksByTitle = (title) => searchBooksByField('title', title);
export const searchBooksByAuthor = (author) => searchBooksByField('author', author);

// Function to get book cover by Open Library ID
export const getBookCover = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

// Function to get author information
export const getAuthorInfo = async (authorKey) => {
  try {
    const cleanKey = authorKey.replace('/authors/', '');
    const response = await axios.get(`https://openlibrary.org/authors/${cleanKey}.json`);
    
    const authorData = response.data;
    
    let photoUrl = null;
    if (authorData.photos && authorData.photos.length > 0) {
      photoUrl = `https://covers.openlibrary.org/a/olid/${cleanKey}-M.jpg`;
    }
    
    return {
      name: authorData.name || 'Unknown Author',
      bio: authorData.bio ? (typeof authorData.bio === 'string' ? authorData.bio : authorData.bio.value) : 'No biography available',
      birthDate: authorData.birth_date,
      deathDate: authorData.death_date,
      photoUrl: photoUrl,
      works: authorData.works ? authorData.works.length : 0
    };
  } catch (error) {
    console.error('Error fetching author info:', error);
    return null;
  }
};