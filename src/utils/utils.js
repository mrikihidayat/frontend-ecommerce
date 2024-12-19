import axios from 'axios';

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const createAxiosInstance = () => {
  const token = localStorage.getItem('_token');

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  return axiosInstance;
};

export const apiRequest = async (method, url, data = {}, params = {}) => {
  try {
    const axiosInstance = createAxiosInstance();

    const config = {
      method,
      url,
      data,
      params,
    };

    const response = await axiosInstance(config);

    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem('_token', response.data.data.token);
      saveUserSession(response.data); 
    }

    return response.data;
  } catch (error) {
    console.error(`Error during ${method} request:`, error);
    throw error;
  }
};

// Manajemen Session LocalStorage
export const saveUserSession = (response) => {
  if (response && response.data) {
    const userData = response.data;

    const userSessionData = {
      _id: userData._id,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      avatar: userData.avatar,
      role: userData.role,
    };

    localStorage.setItem('user', JSON.stringify(userSessionData));
  }
};

export const getUserSession = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const updateUserSession = (updatedData) => {
  const currentUser = getUserSession();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updatedData };
    saveUserSession({ data: updatedUser });
  }
};

export const clearUserSession = () => {
    localStorage.clear();
    sessionStorage.clear();
  };  
