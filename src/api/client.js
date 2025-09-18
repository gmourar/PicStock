import axios from 'axios';
import Constants from 'expo-constants';

const guess = process.env.EXPO_PUBLIC_API_URL
  || Constants?.expoConfig?.extra?.apiBaseUrl
  || 'http://10.0.2.2:3000'; // Android emulador; em iOS simulador use http://localhost:3000

export const API_BASE_URL = guess.endsWith('/api') ? guess : `${guess}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.response.use(
  (r) => r,
  (e) => Promise.reject(e)
);

export default api;
