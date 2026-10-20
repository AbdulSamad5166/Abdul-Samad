import axios from 'axios';

/**
 * Pre-configured Axios instance for DummyJSON REST API.
 */
export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
