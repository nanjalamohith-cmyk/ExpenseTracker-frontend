import axios from 'axios';

// Get and sanitize the API base URL
const sanitizeBaseUrl = (rawUrl) => {
  let url = (rawUrl || 'http://localhost:8081/api').trim();
  
  // Ensure protocol is present
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Remove any trailing slashes
  url = url.replace(/\/+$/, '');
  
  // Ensure it ends with /api
  if (!url.endsWith('/api')) {
    url = url + '/api';
  }
  
  return url;
};

const API_BASE_URL = sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Fetch expenses, optionally filtered by category.
 */
export const getExpenses = async (category) => {
  const params = {};
  if (category && category !== 'All') {
    params.category = category;
  }
  const response = await apiClient.get('/expenses', { params });
  // Ensure the response is actually an array and not an HTML error string
  if (!Array.isArray(response.data)) {
    throw new Error('Invalid server response format. Expected an array of expenses.');
  }
  return response.data;
};

/**
 * Fetch a single expense by ID.
 */
export const getExpenseById = async (id) => {
  const response = await apiClient.get(`/expenses/${id}`);
  return response.data;
};

/**
 * Create a new expense.
 */
export const createExpense = async (expenseData) => {
  const response = await apiClient.post('/expenses', expenseData);
  return response.data;
};

/**
 * Update an existing expense by ID.
 */
export const updateExpense = async (id, expenseData) => {
  const response = await apiClient.put(`/expenses/${id}`, expenseData);
  return response.data;
};

/**
 * Delete an expense by ID.
 */
export const deleteExpense = async (id) => {
  const response = await apiClient.delete(`/expenses/${id}`);
  return response.data;
};

/**
 * Fetch total spent, optionally filtered by category.
 */
export const getTotalExpenses = async (category) => {
  const params = {};
  if (category && category !== 'All') {
    params.category = category;
  }
  const response = await apiClient.get('/expenses/total', { params });
  if (typeof response.data !== 'object' || response.data === null) {
    throw new Error('Invalid total response format.');
  }
  return response.data;
};

export default {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalExpenses,
};
