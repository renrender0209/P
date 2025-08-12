import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Configure axios for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.PROD ? '' : 'http://localhost:3000',
  timeout: 30000,
});

// Default query function for React Query
const defaultQueryFn = async ({ queryKey }) => {
  try {
    const [url, ...params] = queryKey;
    console.log('Fetching:', url);
    const response = await apiClient.get(url, { params: params[0] });
    console.log('Query success:', url, 'Data:', Array.isArray(response.data) ? `${response.data.length} items` : 'object');
    return response.data;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

// Create Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

// API request helper for mutations
export const apiRequest = async (url, options = {}) => {
  const { method = 'GET', data, params } = options;
  
  const config = {
    method,
    url,
    params,
    timeout: 30000,
  };
  
  if (data) {
    config.data = data;
  }
  
  const response = await apiClient(config);
  return response.data;
};