import React from 'react';
import { SearchIcon, BookIcon, EditIcon, TrashIcon, RefreshIcon, CheckIcon } from './Icons';

export default function BookCatalog({
  books,
  loading,
  error,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedAvailability,
  onAvailabilityChange,
  onOpenAddBook,
  onEditBook,
  onDeleteBook,
  onToggleAvailability,
  onRetry
}) {
  const getCategoryColorClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.contains ? cat.contains('prog') : cat.includes('prog')) return 'cat-programming';
    if (cat.includes('data')) return 'cat-database';
    if (cat.includes('netw')) return 'cat-networking';
    if (cat.includes('ai') || cat.includes('machine')) return 'cat-ai';
    if (cat.includes('soft') || cat.includes('design')) return 'cat-software';
    if (cat.includes('algo')) return 'cat-algorithms';
    return 'cat-general';
  };

  return (
    <div className="catalog-section">
      {/* Controls Bar */}
      <div className="catalog-controls">
        <div className="search-box">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, or topic..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => onSearchChange('')}>
              ×
            </button>
          )}
        </div>

        <div className="filter-group">
          {/* Category Selector */}
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All Disciplines</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <div className="availability-pills">
            <button
              className={`pill-btn ${selectedAvailability === '' ? 'active' : ''}`}
              onClick={() => onAvailabilityChange('')}
            >
              All Status
            </button>
            <button
              className={`pill-btn ${selectedAvailability === 'true' ? 'active' : ''}`}
              onClick={() => onAvailabilityChange('true')}
            >
              Available
            </button>
            <button
              className={`pill-btn ${selectedAvailability === 'false' ? 'active' : ''}`}
              onClick={() => onAvailabilityChange('false')}
            >
              Checked Out
            </button>
          </div>

          <button className="btn-primary-sm btn-add-book" onClick={onOpenAddBook}>
            + Add Book
          </button>
        </div>
      </div>

      {/* Catalog Status Bar */}
      <div className="catalog-meta-bar">
        <span className="results-count">
          Showing <strong>{books.length}</strong> {books.length === 1 ? 'publication' : 'publications'}
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {selectedAvailability !== '' && ` (${selectedAvailability === 'true' ? 'Available only' : 'Checked out only'})`}
        </span>

        {(searchQuery || selectedCategory !== 'All' || selectedAvailability !== '') && (
          <button
            className="btn-reset-filters"
            onClick={() => {
              onSearchChange('');
              onCategoryChange('All');
              onAvailabilityChange('');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="catalog-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="book-card-skeleton">
              <div className="skeleton-cover" />
              <div className="skeleton-line title" />
              <div className="skeleton-line author" />
              <div className="skeleton-line badge" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="catalog-error-state">
          <div className="error-icon-box">⚠️</div>
          <h3>Unable to Load Book Catalog</h3>
          <p>{error}</p>
          <button className="btn-secondary-sm" onClick={onRetry}>
            <RefreshIcon className="icon-xs" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && books.length === 0 && (
        <div className="catalog-empty-state">
          <BookIcon className="empty-icon" />
          <h3>No Books Found</h3>
          <p>
            No catalog publications matched your search criteria. Try modifying your keywords or clearing category filters.
          </p>
          <button
            className="btn-primary-sm"
            onClick={() => {
              onSearchChange('');
              onCategoryChange('All');
              onAvailabilityChange('');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && books.length > 0 && (
        <div className="catalog-grid">
          {books.map((book) => {
            const catColor = getCategoryColorClass(book.category);
            return (
              <div key={book.id} className="book-card">
                {/* CSS Cover Graphic */}
                <div className={`book-cover-art ${catColor}`}>
                  <div className="book-spine" />
                  <div className="book-cover-content">
                    <span className="book-cover-category">{book.category}</span>
                    <h4 className="book-cover-title">{book.title}</h4>
                    <span className="book-cover-author">{book.author}</span>
                  </div>
                  <div className="book-cover-emboss">
                    <BookIcon className="icon-sm" />
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="book-card-body">
                  <div className="book-card-header">
                    <span className="category-tag">{book.category}</span>
                    <span
                      className={`status-pill ${book.available ? 'status-available' : 'status-unavailable'}`}
                    >
                      {book.available ? '● Available' : '○ Checked Out'}
                    </span>
                  </div>

                  <h3 className="book-title" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="book-author">By {book.author}</p>

                  {book.isbn && (
                    <p className="book-isbn">
                      <span className="isbn-label">ISBN:</span> {book.isbn}
                    </p>
                  )}

                  {book.description && (
                    <p className="book-description">
                      {book.description}
                    </p>
                  )}

                  {/* Actions Footer */}
                  <div className="book-card-footer">
                    <button
                      className={`btn-toggle-availability ${book.available ? 'btn-borrow' : 'btn-return'}`}
                      onClick={() => onToggleAvailability(book)}
                      title={book.available ? "Mark as Borrowed / Checked Out" : "Mark as Returned / Available"}
                    >
                      <CheckIcon className="icon-xs" />
                      <span>{book.available ? 'Borrow Book' : 'Return Book'}</span>
                    </button>

                    <div className="book-management-btns">
                      <button
                        className="btn-icon-action"
                        onClick={() => onEditBook(book)}
                        title="Edit Book Details"
                      >
                        <EditIcon className="icon-xs" />
                      </button>
                      <button
                        className="btn-icon-action danger"
                        onClick={() => onDeleteBook(book.id, book.title)}
                        title="Delete Book from Catalog"
                      >
                        <TrashIcon className="icon-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
