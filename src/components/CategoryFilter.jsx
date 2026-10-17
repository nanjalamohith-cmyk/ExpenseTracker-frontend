import React from 'react';

const CATEGORIES = [
  { id: 'All', label: 'All Categories', icon: '🌐' },
  { id: 'Food', label: 'Food & Dining', icon: '🍔' },
  { id: 'Travel', label: 'Travel & Commute', icon: '✈️' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'Other', label: 'Other', icon: '🏷️' },
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-filter-container glass-panel">
      <div className="filter-header">
        <div className="filter-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span className="filter-label">Filter by Category:</span>
        </div>

        {/* Dropdown element as explicitly specified in requirements */}
        <div className="filter-select-wrapper">
          <select
            id="category-dropdown-filter"
            className="filter-select-input"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            aria-label="Filter expenses by category"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          <div className="select-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick selection pills for superior user experience */}
      <div className="filter-quick-pills" role="radiogroup" aria-label="Category filter pills">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`filter-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              role="radio"
              aria-checked={isActive}
            >
              <span className="pill-icon">{cat.icon}</span>
              <span className="pill-name">{cat.id === 'All' ? 'All' : cat.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
