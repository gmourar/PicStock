import axios from 'axios';
import Constants from 'expo-constants';

const guessedBase =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants?.expoConfig?.extra?.apiBaseUrl) ||
  'http://localhost:3000';

export const API_BASE_URL = guessedBase.endsWith('/api')
  ? guessedBase
  : `${guessedBase}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Interceptador opcional para log simples
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Você pode adicionar tratamento de erro global aqui
    return Promise.reject(error);
  }
);

export default api;
