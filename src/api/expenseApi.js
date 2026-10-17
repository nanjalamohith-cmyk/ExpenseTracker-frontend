import axios from 'axios';

// Base API client configured for Spring Boot backend (port 8081)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch expenses, optionally filtered by category.
 * @param {string} [category] - Optional category filter (e.g. 'Food', 'Travel', 'Shopping', 'Other', or 'All')
 * @returns {Promise<Array>} List of expenses
 */
export const getExpenses = async (category) => {
  const params = {};
  if (category && category !== 'All') {
    params.category = category;
  }
  const response = await apiClient.get('/expenses', { params });
  return response.data;
};

/**
 * Fetch a single expense by ID.
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Expense item
 */
export const getExpenseById = async (id) => {
  const response = await apiClient.get(`/expenses/${id}`);
  return response.data;
};

/**
 * Create a new expense.
 * @param {Object} expenseData - { title, amount, category, date }
 * @returns {Promise<Object>} Created expense
 */
export const createExpense = async (expenseData) => {
  const response = await apiClient.post('/expenses', expenseData);
  return response.data;
};

/**
 * Update an existing expense by ID.
 * @param {string} id - Expense ID
 * @param {Object} expenseData - { title, amount, category, date }
 * @returns {Promise<Object>} Updated expense
 */
export const updateExpense = async (id, expenseData) => {
  const response = await apiClient.put(`/expenses/${id}`, expenseData);
  return response.data;
};

/**
 * Delete an expense by ID.
 * @param {string} id - Expense ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteExpense = async (id) => {
  const response = await apiClient.delete(`/expenses/${id}`);
  return response.data;
};

/**
 * Fetch total spent, optionally filtered by category.
 * @param {string} [category] - Optional category filter
 * @returns {Promise<Object>} { category, total, count }
 */
export const getTotalExpenses = async (category) => {
  const params = {};
  if (category && category !== 'All') {
    params.category = category;
  }
  const response = await apiClient.get('/expenses/total', { params });
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
