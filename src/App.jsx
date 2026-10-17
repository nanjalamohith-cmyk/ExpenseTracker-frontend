import React, { useState, useEffect, useCallback } from 'react';
import expenseApi from './api/expenseApi';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import CategoryFilter from './components/CategoryFilter';
import TotalCard from './components/TotalCard';
import Notification from './components/Notification';
import CategoryBreakdown from './components/CategoryBreakdown';

function App() {
  // Application State
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [totalData, setTotalData] = useState({ category: 'All', total: 0, count: 0 });
  const [grandTotalData, setGrandTotalData] = useState({ category: 'All', total: 0, count: 0 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentExpense, setCurrentExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState(null);
  const [notification, setNotification] = useState(null);

  // Helper to trigger notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Load expenses and totals from backend
  const loadExpensesData = useCallback(async (categoryToFetch = selectedCategory) => {
    setIsLoading(true);
    try {
      const [listResult, totalResult, allListResult, grandTotalResult] = await Promise.all([
        expenseApi.getExpenses(categoryToFetch),
        expenseApi.getTotalExpenses(categoryToFetch),
        expenseApi.getExpenses('All'),
        expenseApi.getTotalExpenses('All'),
      ]);

      setExpenses(Array.isArray(listResult) ? listResult : []);
      setTotalData(totalResult || { category: categoryToFetch, total: 0, count: 0 });
      setAllExpenses(Array.isArray(allListResult) ? allListResult : []);
      setGrandTotalData(grandTotalResult || { category: 'All', total: 0, count: 0 });
    } catch (err) {
      console.error('Failed to load expenses:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Could not connect to backend server. Make sure the Spring Boot service is healthy and online.';
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // Initial load
  useEffect(() => {
    loadExpensesData(selectedCategory);
  }, [selectedCategory, loadExpensesData]);

  // Handle category filter changes
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  // Handle Form Submit (Add or Update)
  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    setBackendErrors(null);

    try {
      if (currentExpense && currentExpense.id) {
        // UPDATE MODE
        await expenseApi.updateExpense(currentExpense.id, formData);
        showNotification('Expense updated successfully!', 'success');
        setCurrentExpense(null);
      } else {
        // CREATE MODE
        await expenseApi.createExpense(formData);
        showNotification('Expense added successfully!', 'success');
      }

      // Re-fetch data to reflect changes
      await loadExpensesData(selectedCategory);
    } catch (err) {
      console.error('Form submission failed:', err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.errors) {
          // Backend field-level validation errors
          setBackendErrors(errorData.errors);
          showNotification('Please correct the validation errors in the form.', 'error');
        } else if (errorData.message) {
          showNotification(errorData.message, 'error');
        } else {
          showNotification('Failed to save expense. Please check input.', 'error');
        }
      } else {
        showNotification('Failed to communicate with the server.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit initiation
  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setBackendErrors(null);
    // Smooth scroll to form container
    const formElement = document.getElementById('expense-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setCurrentExpense(null);
    setBackendErrors(null);
  };

  // Handle Delete
  const handleDeleteExpense = async (id) => {
    try {
      await expenseApi.deleteExpense(id);
      showNotification('Expense deleted successfully.', 'success');

      // If we deleted the item currently being edited, cancel edit
      if (currentExpense && currentExpense.id === id) {
        setCurrentExpense(null);
        setBackendErrors(null);
      }

      // Refresh list and totals
      await loadExpensesData(selectedCategory);
    } catch (err) {
      console.error('Delete failed:', err);
      const msg = err.response?.data?.message || 'Failed to delete expense.';
      showNotification(msg, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      <Notification notification={notification} onClose={closeNotification} />

      {/* Modern App Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-brand">
            <div className="brand-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div>
              <h1 className="brand-title">ExpenseTracker</h1>
              <p className="brand-tagline">Personal Finance & Spending Intelligence</p>
            </div>
          </div>

          <div className="header-status-badge">
            <span className="live-pulse-dot"></span>
            <span>MongoDB Connected</span>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="dashboard-layout">
        {/* Top Analytics Row */}
        <section className="top-stats-row" aria-label="Financial Summary">
          {/* Total Card */}
          <TotalCard
            totalData={totalData}
            activeCategory={selectedCategory}
            totalAllAmount={grandTotalData?.total}
          />

          {/* Category Breakdown (Bonus Requirement) */}
          <CategoryBreakdown
            allExpenses={allExpenses}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </section>

        {/* Form and Filter Area */}
        <div className="content-grid">
          {/* Left Column: Expense Form */}
          <section id="expense-form-section" className="form-column" aria-label="Expense Form">
            <ExpenseForm
              currentExpense={currentExpense}
              onSubmit={handleSubmitForm}
              onCancelEdit={handleCancelEdit}
              backendErrors={backendErrors}
              isSubmitting={isSubmitting}
            />
          </section>

          {/* Right Column: Filter & Records Table */}
          <section className="table-column" aria-label="Expense Records">
            {/* Category Filter */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Expenses Table */}
            <ExpenseTable
              expenses={expenses}
              isLoading={isLoading}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              selectedCategory={selectedCategory}
              activeEditId={currentExpense?.id}
            />
          </section>
        </div>
      </main>

      {/* App Footer */}
      <footer className="app-footer">
        <p>Expense Tracker Full-Stack Application • React.js + Spring Boot 3.x + MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
