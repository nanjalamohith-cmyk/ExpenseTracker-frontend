import React, { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Other'];

const ExpenseForm = ({ currentExpense, onSubmit, onCancelEdit, backendErrors, isSubmitting }) => {
  // Get today's date formatted as YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const initialFormState = {
    title: '',
    amount: '',
    category: 'Food',
    date: getTodayDateString(),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [clientErrors, setClientErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Synchronize form when entering or leaving edit mode
  useEffect(() => {
    if (currentExpense) {
      setFormData({
        title: currentExpense.title || '',
        amount: currentExpense.amount !== undefined ? String(currentExpense.amount) : '',
        category: currentExpense.category || 'Food',
        date: currentExpense.date || getTodayDateString(),
      });
      setClientErrors({});
      setTouched({});
    } else {
      setFormData(initialFormState);
      setClientErrors({});
      setTouched({});
    }
  }, [currentExpense]);

  // Client-side validation function
  const validate = () => {
    const errors = {};

    // 1. Title validation: must not be empty or blank
    if (!formData.title || !formData.title.trim()) {
      errors.title = 'Title must not be empty or blank.';
    }

    // 2. Amount validation: must be greater than 0
    if (formData.amount === '' || formData.amount === null || formData.amount === undefined) {
      errors.amount = 'Amount is required.';
    } else {
      const numAmount = Number(formData.amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        errors.amount = 'Amount must be greater than 0.';
      }
    }

    // 3. Category validation: Food, Travel, Shopping, Other
    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      errors.category = 'Category must be one of: Food, Travel, Shopping, Other.';
    }

    // 4. Date validation: required
    if (!formData.date || !formData.date.trim()) {
      errors.date = 'Date is required.';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear client errors for the modified field as user types
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      title: true,
      amount: true,
      category: true,
      date: true,
    });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setClientErrors(validationErrors);
      return;
    }

    // If client validation passes, invoke parent handler
    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(Number(formData.amount).toFixed(2)),
      category: formData.category,
      date: formData.date,
    };

    onSubmit(payload);
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setClientErrors({});
    setTouched({});
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const isEditing = Boolean(currentExpense);

  // Combine client-side errors and backend-returned field errors
  const getFieldError = (fieldName) => {
    return clientErrors[fieldName] || (backendErrors && backendErrors[fieldName]);
  };

  return (
    <div className="expense-form-card glass-panel">
      <div className="form-header">
        <div className="form-icon-circle">
          {isEditing ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </div>
        <div>
          <h2 className="form-title">{isEditing ? 'Update Expense' : 'Add New Expense'}</h2>
          <p className="form-subtitle">
            {isEditing ? 'Modify expense parameters and save updates' : 'Record a new transaction to track spending'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="expense-form">
        <div className="form-grid">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="expense-title" className="form-label">
              Expense Title <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <input
                id="expense-title"
                name="title"
                type="text"
                placeholder="e.g. Grocery store, Uber ride, Dinner"
                className={`form-input ${getFieldError('title') ? 'input-error' : ''}`}
                value={formData.title}
                onChange={handleChange}
                onBlur={() => handleBlur('title')}
                autoComplete="off"
              />
            </div>
            {getFieldError('title') && (
              <span className="error-message" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {getFieldError('title')}
              </span>
            )}
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="expense-amount" className="form-label">
              Amount (₹) <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon currency-prefix">₹</span>
              <input
                id="expense-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`form-input ${getFieldError('amount') ? 'input-error' : ''}`}
                value={formData.amount}
                onChange={handleChange}
                onBlur={() => handleBlur('amount')}
              />
            </div>
            {getFieldError('amount') && (
              <span className="error-message" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {getFieldError('amount')}
              </span>
            )}
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="expense-category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </span>
              <select
                id="expense-category"
                name="category"
                className={`form-input form-select ${getFieldError('category') ? 'input-error' : ''}`}
                value={formData.category}
                onChange={handleChange}
                onBlur={() => handleBlur('category')}
              >
                <option value="Food">Food (Dining & Groceries)</option>
                <option value="Travel">Travel (Fuel, Flights, Commute)</option>
                <option value="Shopping">Shopping (Apparel, Electronics)</option>
                <option value="Other">Other (Bills, Miscellaneous)</option>
              </select>
            </div>
            {getFieldError('category') && (
              <span className="error-message" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {getFieldError('category')}
              </span>
            )}
          </div>

          {/* Date Field */}
          <div className="form-group">
            <label htmlFor="expense-date" className="form-label">
              Date <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              <input
                id="expense-date"
                name="date"
                type="date"
                className={`form-input ${getFieldError('date') ? 'input-error' : ''}`}
                value={formData.date}
                onChange={handleChange}
                onBlur={() => handleBlur('date')}
              />
            </div>
            {getFieldError('date') && (
              <span className="error-message" role="alert">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {getFieldError('date')}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className={`btn btn-primary ${isEditing ? 'btn-update' : 'btn-add'}`}
            disabled={isSubmitting}
            id="submit-expense-button"
          >
            {isSubmitting ? (
              <span className="btn-spinner-wrap">
                <span className="mini-spinner"></span>
                <span>Saving...</span>
              </span>
            ) : isEditing ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Update Expense</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add Expense</span>
              </>
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary btn-cancel"
              onClick={handleReset}
              disabled={isSubmitting}
              id="cancel-edit-button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Cancel Edit</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
