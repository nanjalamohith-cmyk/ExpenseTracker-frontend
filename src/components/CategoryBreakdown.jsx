import React from 'react';
import { formatCurrency } from './TotalCard';

const CATEGORIES = [
  { name: 'Food', label: 'Food', icon: '🍔', color: '#f97316' },
  { name: 'Travel', label: 'Travel', icon: '✈️', color: '#0ea5e9' },
  { name: 'Shopping', label: 'Shopping', icon: '🛍️', color: '#a855f7' },
  { name: 'Other', label: 'Other', icon: '🏷️', color: '#10b981' },
];

const CategoryBreakdown = ({ allExpenses, selectedCategory, onSelectCategory }) => {
  // Compute totals per category from all expenses
  const categoryStats = CATEGORIES.map((cat) => {
    const matchingExpenses = allExpenses.filter(
      (e) => e.category && e.category.toLowerCase() === cat.name.toLowerCase()
    );
    const sum = matchingExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return {
      ...cat,
      total: sum,
      count: matchingExpenses.length,
    };
  });

  const grandTotal = categoryStats.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="category-breakdown-card glass-panel">
      <div className="breakdown-header">
        <h3 className="breakdown-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Category Spending Breakdown
        </h3>
        <span className="breakdown-subtitle">Distribution across categories</span>
      </div>

      <div className="breakdown-grid">
        {categoryStats.map((item) => {
          const percent = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
          const isSelected = selectedCategory === item.name;

          return (
            <div
              key={item.name}
              className={`breakdown-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'All' : item.name)}
              role="button"
              tabIndex={0}
              title={`Click to filter by ${item.name}`}
            >
              <div className="breakdown-item-top">
                <span className="item-icon-tag">{item.icon}</span>
                <span className="item-name">{item.name}</span>
                <span className="item-percent">{percent.toFixed(1)}%</span>
              </div>

              <div className="breakdown-progress-track">
                <div
                  className="breakdown-progress-bar"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>

              <div className="breakdown-item-bottom">
                <span className="item-total">{formatCurrency(item.total)}</span>
                <span className="item-count">
                  {item.count} {item.count === 1 ? 'txn' : 'txns'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
