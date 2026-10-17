import React, { useState } from 'react';
import { formatCurrency } from './TotalCard';

// Helper for formatting dates to readable display (e.g., '18 Oct 2026')
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    }
    return dateString;
  } catch {
    return dateString;
  }
};

const CATEGORY_META = {
  Food: { icon: '🍔', badgeClass: 'badge-food' },
  Travel: { icon: '✈️', badgeClass: 'badge-travel' },
  Shopping: { icon: '🛍️', badgeClass: 'badge-shopping' },
  Other: { icon: '🏷️', badgeClass: 'badge-other' },
};

const ExpenseTable = ({
  expenses,
  isLoading,
  onEdit,
  onDelete,
  selectedCategory,
  activeEditId,
}) => {
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const handleOpenDeleteConfirm = (expense) => {
    setExpenseToDelete(expense);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      onDelete(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setExpenseToDelete(null);
  };

  return (
    <div className="expense-table-container glass-panel">
      <div className="table-header-bar">
        <div className="table-title-group">
          <h2 className="table-title">Expense Records</h2>
          <span className="table-count-badge">
            {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="table-loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="table-empty-state">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <h3 className="empty-state-title">No expenses found</h3>
          <p className="empty-state-subtitle">
            {selectedCategory && selectedCategory !== 'All'
              ? `There are no recorded expenses under the "${selectedCategory}" category.`
              : 'Your expense list is currently empty. Use the form above to add your first expense!'}
          </p>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="expense-table" aria-label="Expenses table">
            <thead>
              <tr>
                <th scope="col" className="th-title">Title</th>
                <th scope="col" className="th-amount">Amount</th>
                <th scope="col" className="th-category">Category</th>
                <th scope="col" className="th-date">Date</th>
                <th scope="col" className="th-actions text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const meta = CATEGORY_META[expense.category] || { icon: '🏷️', badgeClass: 'badge-other' };
                const isCurrentlyEditing = activeEditId === expense.id;

                return (
                  <tr
                    key={expense.id}
                    className={`expense-table-row ${isCurrentlyEditing ? 'row-editing' : ''}`}
                  >
                    <td className="td-title">
                      <div className="title-cell-wrap">
                        <span className="expense-title-text">{expense.title}</span>
                        {isCurrentlyEditing && (
                          <span className="editing-tag">Editing</span>
                        )}
                      </div>
                    </td>
                    <td className="td-amount">
                      <span className="amount-value">{formatCurrency(expense.amount)}</span>
                    </td>
                    <td className="td-category">
                      <span className={`category-badge ${meta.badgeClass}`}>
                        <span className="category-emoji">{meta.icon}</span>
                        <span>{expense.category}</span>
                      </span>
                    </td>
                    <td className="td-date">
                      <span className="date-value">{formatDate(expense.date)}</span>
                    </td>
                    <td className="td-actions text-right">
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          onClick={() => onEdit(expense)}
                          title="Edit this expense"
                          aria-label={`Edit ${expense.title}`}
                          id={`edit-btn-${expense.id}`}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => handleOpenDeleteConfirm(expense)}
                          title="Delete this expense"
                          aria-label={`Delete ${expense.title}`}
                          id={`delete-btn-${expense.id}`}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modern Confirmation Modal for Delete */}
      {expenseToDelete && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
          <div className="modal-content glass-panel">
            <div className="modal-warning-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3 id="delete-dialog-title" className="modal-title">Confirm Delete</h3>
            <p className="modal-desc">
              Are you sure you want to delete the expense{' '}
              <strong>"{expenseToDelete.title}"</strong> ({formatCurrency(expenseToDelete.amount)})?
              This action cannot be undone.
            </p>
            <div className="modal-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                id="confirm-delete-button"
              >
                Delete Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
