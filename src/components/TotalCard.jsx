import React from 'react';

/**
 * Helper to format a number/BigDecimal into Indian Rupee currency format (₹ xx,xxx.xx).
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }
  const numericVal = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericVal);
};

const TotalCard = ({ totalData, activeCategory, totalAllAmount }) => {
  const isFiltered = activeCategory && activeCategory !== 'All';
  const displayTotal = totalData ? totalData.total : 0;
  const count = totalData ? totalData.count : 0;

  return (
    <div className="total-card-wrapper">
      <div className="total-card glass-panel">
        <div className="total-card-header">
          <div className="total-badge-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="total-card-title-group">
            <span className="total-card-subtitle">
              {isFiltered ? `${activeCategory} Category Total` : 'Overall Spending'}
            </span>
            <h3 className="total-card-category-indicator">
              {isFiltered ? `Filtered: ${activeCategory}` : 'All Expenses'}
            </h3>
          </div>
          {isFiltered && (
            <span className="filtered-pill-badge">
              Active Filter
            </span>
          )}
        </div>

        <div className="total-card-body">
          <div className="total-amount-display">
            <span className="currency-symbol">₹</span>
            <span className="currency-number">
              {displayTotal !== undefined && displayTotal !== null
                ? Number(displayTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '0.00'}
            </span>
          </div>
        </div>

        <div className="total-card-footer">
          <div className="total-meta-stat">
            <span className="meta-dot"></span>
            <span className="meta-text">
              <strong>{count}</strong> {count === 1 ? 'transaction' : 'transactions'}
            </span>
          </div>

          {isFiltered && totalAllAmount !== undefined && (
            <div className="total-meta-stat total-ratio">
              <span className="meta-text">
                {totalAllAmount > 0
                  ? `${((Number(displayTotal) / Number(totalAllAmount)) * 100).toFixed(1)}% of total portfolio`
                  : '0% of total'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalCard;
