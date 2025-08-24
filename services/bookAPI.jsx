import axios from 'axios';

const OPEN_LIBRARY_API = 'https://openlibrary.org/search.json';

// Helper function to normalize subject keys
const normalizeSubjectKey = (subject) => {
  return subject
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// services/bookAPI.js
export const searchBooks = async (query, searchType = 'title') => {
  try {
    let url;
    let params = {};
    
    if (searchType === 'subject') {
      // Search by subject using Open Library's search API with subject field
      params = {
        subject: query,
        limit: 20,
        fields: 'key,title,author_name,cover_i,subject'
      };
    } else if (searchType === 'subject_key') {
      // Exact subject match using subject_key
      const subjectKey = normalizeSubjectKey(query);
      params = {
        subject_key: subjectKey,
        limit: 20,
        fields: 'key,title,author_name,cover_i,subject'
      };
    } else {
      // Default search by title/author
      params = {
        q: query,
        limit: 20,
        fields: 'key,title,author_name,cover_i,subject'
      };
    }
    
    const response = await axios.get(OPEN_LIBRARY_API, { params });
    const data = response.data;
    
    // Process search results
    return data.docs?.map(doc => ({
      id: doc.key,
      title: doc.title || 'Unknown Title',
      author: doc.author_name?.[0] || 'Unknown Author',
      coverUrl: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      subjects: doc.subject || []
    })) || [];
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Advanced subject search with multiple options
export const searchBooksBySubject = async (subject, options = {}) => {
  try {
    const {
      exactMatch = false,
      excludeSubjects = [],
      limit = 20
    } = options;

    let query = '';
    
    if (exactMatch) {
      const subjectKey = normalizeSubjectKey(subject);
      query = `subject_key:${subjectKey}`;
    } else {
      query = `subject:${subject}`;
    }

    // Add negative search for excluded subjects
    excludeSubjects.forEach(excludedSubject => {
      const excludedKey = normalizeSubjectKey(excludedSubject);
      query += ` -subject_key:${excludedKey}`;
    });

    const params = {
      q: query,
      limit: limit,
      fields: 'key,title,author_name,cover_i,subject'
    };

    const response = await axios.get(OPEN_LIBRARY_API, { params });
    const data = response.data;
    
    return data.docs?.map(doc => ({
      id: doc.key,
      title: doc.title || 'Unknown Title',
      author: doc.author_name?.[0] || 'Unknown Author',
      coverUrl: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      subjects: doc.subject || [],
      searchType: 'subject'
    })) || [];
  } catch (error) {
    console.error('Subject search error:', error);
    throw error;
  }
};

// Search by multiple criteria
export const advancedBookSearch = async (criteria) => {
  try {
    let queryParts = [];
    
    if (criteria.title) queryParts.push(`title:${criteria.title}`);
    if (criteria.author) queryParts.push(`author:${criteria.author}`);
    if (criteria.subject) queryParts.push(`subject:${criteria.subject}`);
    if (criteria.subject_key) {
      const subjectKey = normalizeSubjectKey(criteria.subject_key);
      queryParts.push(`subject_key:${subjectKey}`);
    }
    if (criteria.place) queryParts.push(`place:${criteria.place}`);
    if (criteria.time) queryParts.push(`time:${criteria.time}`);
    if (criteria.person) queryParts.push(`person:${criteria.person}`);
    
    // Add negative searches
    if (criteria.exclude_subject) {
      const excludedKey = normalizeSubjectKey(criteria.exclude_subject);
      queryParts.push(`-subject_key:${excludedKey}`);
    }

    const query = queryParts.join(' ');
    
    const params = {
      q: query,
      limit: criteria.limit || 20,
      fields: 'key,title,author_name,cover_i,subject,first_publish_year'
    };

    const response = await axios.get(OPEN_LIBRARY_API, { params });
    const data = response.data;
    
    return data.docs?.map(doc => ({
      id: doc.key,
      title: doc.title || 'Unknown Title',
      author: doc.author_name?.[0] || 'Unknown Author',
      coverUrl: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      subjects: doc.subject || [],
      publishedYear: doc.first_publish_year,
      searchType: 'advanced'
    })) || [];
  } catch (error) {
    console.error('Advanced search error:', error);
    throw error;
  }
};

// Get popular subjects (for suggestions)
export const getPopularSubjects = async (limit = 10) => {
  try {
    // This is a simplified approach - you might want to use a different endpoint
    const response = await axios.get('https://openlibrary.org/subjects.json', {
      params: {
        limit: limit
      }
    });
    
    return response.data.works?.map(work => ({
      name: work.subject,
      count: work.work_count,
      key: normalizeSubjectKey(work.subject)
    })) || [];
  } catch (error) {
    console.error('Error fetching popular subjects:', error);
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

// Function to get book cover by Open Library ID
export const getBookCover = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};