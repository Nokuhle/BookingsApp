// For user data
export const saveUser = (user) => {
  localStorage.setItem('readify_user', JSON.stringify(user));
};

export const loadUser = () => {
  const user = localStorage.getItem('readify_user');
  return user ? JSON.parse(user) : null;
};

// Remove book-related functions since we're focusing on auth only