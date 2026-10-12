import React, { useState } from 'react';
import { CloseIcon, BookIcon } from './Icons';

function BookForm({ editingBook, onSave, onClose }) {
  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [category, setCategory] = useState(editingBook?.category || 'Programming');
  const [isbn, setIsbn] = useState(editingBook?.isbn || '');
  const [description, setDescription] = useState(editingBook?.description || '');
  const [available, setAvailable] = useState(editingBook?.available ?? true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!author.trim()) {
      setError('Author is required');
      return;
    }
    if (!category.trim()) {
      setError('Category is required');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        isbn: isbn.trim(),
        description: description.trim(),
        available
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      {error && <div className="form-alert error">{error}</div>}

      <div className="form-group">
        <label>Book Title *</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Clean Code"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Author *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Robert C. Martin"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Academic Category *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Programming, Database, AI"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>ISBN (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 978-0132350884"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <span>Available for Immediate Loan</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          className="form-textarea"
          rows={3}
          placeholder="Overview of topics covered, syllabus relevance, or edition details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : editingBook ? 'Save Changes' : 'Add to Catalog'}
        </button>
      </div>
    </form>
  );
}

export function BookModal({ isOpen, onClose, onSave, editingBook }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <BookIcon className="icon-sm" />
            </div>
            <h3>{editingBook ? 'Edit Book Details' : 'Register New Publication'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <CloseIcon className="icon-sm" />
          </button>
        </div>

        <BookForm
          key={editingBook ? editingBook.id : 'new-book'}
          editingBook={editingBook}
          onSave={onSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, bookTitle, deleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-danger">Delete Publication</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <CloseIcon className="icon-sm" />
          </button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to permanently delete <strong>"{bookTitle}"</strong> from the library catalog?
          </p>
          <p className="modal-subtext">This action cannot be undone.</p>
        </div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
