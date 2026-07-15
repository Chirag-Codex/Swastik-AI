export const getToken = () => {
  return localStorage.getItem('jwt');
};

export const setToken = (token) => {
  localStorage.setItem('jwt', token);
};

export const removeToken = () => {
  localStorage.removeItem('jwt');
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const logout = () => {
  removeToken();
  removeUser();
};

export const isAuthenticated = () => {
  return !!getToken();
};