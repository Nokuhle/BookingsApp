import axios from 'axios';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query) => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_API, {
      params: {
        q: query,
        maxResults: 10,
        printType: 'books'
      }
    });
    
    return response.data.items.map(item => {
      const volumeInfo = item.volumeInfo;
      return {
        id: item.id,
        title: volumeInfo.title,
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
        coverUrl: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : null,
        publishedDate: volumeInfo.publishedDate,
        pageCount: volumeInfo.pageCount,
        description: volumeInfo.description
      };
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};