import React from 'react';
import { BookIcon, SparklesIcon, PlusIcon, RefreshIcon } from './Icons';

export default function DashboardStats({
  user,
  stats,
  loading,
  onRefresh,
  onOpenAddBook,
  onOpenChat,
  onSelectCategory
}) {
  const total = stats?.totalBooks || 0;
  const available = stats?.availableBooks || 0;
  const borrowed = stats?.borrowedBooks || 0;
  const categoriesCount = stats?.totalCategories || 0;
  const breakdown = stats?.categoryBreakdown || {};

  return (
    <div className="dashboard-stats-container">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-welcome">
            Welcome back, {user ? user.name : 'Student'}
          </h2>
          <p className="dashboard-subtitle">
            Here is the live status of the academic library inventory and resources.
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary-sm" onClick={onRefresh} disabled={loading} title="Refresh data">
            <RefreshIcon className={`icon-xs ${loading ? 'spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary-sm" onClick={onOpenAddBook}>
            <PlusIcon className="icon-xs" />
            <span>Add Book</span>
          </button>
          <button className="btn-ai-sm" onClick={onOpenChat}>
            <SparklesIcon className="icon-xs" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-box navy">
            <BookIcon className="icon-md" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Total Books</span>
            <span className="kpi-value">{loading ? '...' : total}</span>
            <span className="kpi-hint">Registered in library catalog</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box emerald">
            <BookIcon className="icon-md" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Available for Loan</span>
            <span className="kpi-value">{loading ? '...' : available}</span>
            <span className="kpi-hint text-emerald">
              {total > 0 ? `${Math.round((available / total) * 100)}% in stock` : 'Ready to checkout'}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box amber">
            <BookIcon className="icon-md" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Currently Borrowed</span>
            <span className="kpi-value">{loading ? '...' : borrowed}</span>
            <span className="kpi-hint text-amber">Checked out by students</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box teal">
            <SparklesIcon className="icon-md" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">Academic Disciplines</span>
            <span className="kpi-value">{loading ? '...' : categoriesCount}</span>
            <span className="kpi-hint">Distinct study subjects</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Pill List */}
      {Object.keys(breakdown).length > 0 && (
        <div className="category-breakdown-card">
          <h3 className="breakdown-title">Inventory by Discipline</h3>
          <div className="category-pill-wrap">
            {Object.entries(breakdown).map(([catName, count]) => (
              <button
                key={catName}
                className="category-stat-pill"
                onClick={() => onSelectCategory && onSelectCategory(catName)}
                title={`Filter books by ${catName}`}
              >
                <span className="cat-pill-name">{catName}</span>
                <span className="cat-pill-count">{count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
