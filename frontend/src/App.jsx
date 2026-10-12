import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import DashboardStats from './components/DashboardStats';
import BookCatalog from './components/BookCatalog';
import { BookModal, DeleteConfirmModal } from './components/BookModal';
import AIAssistantModal from './components/AIAssistantModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { SparklesIcon } from './components/Icons';
import { api, authStorage } from './services/api';
import './App.css';

function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState('home'); // 'home' | 'catalog' | 'dashboard'

  // User Authentication State
  const [user, setUser] = useState(() => authStorage.getUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Book Catalog & Filtering State
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [categories, setCategories] = useState([]);

  // Dashboard Stats State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Book Modal (Add / Edit) State
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [deletingBookTitle, setDeletingBookTitle] = useState('');
  const [deleting, setDeleting] = useState(false);

  // AI Assistant Drawer State
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Backend Health State
  const [backendOnline, setBackendOnline] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Books from Backend API
  const fetchBooks = useCallback(async () => {
    setBooksLoading(true);
    setBooksError('');
    try {
      const data = await api.books.getAll({
        search: searchQuery,
        category: selectedCategory,
        available: selectedAvailability
      });
      setBooks(Array.isArray(data) ? data : []);
      setBackendOnline(true);
    } catch (err) {
      console.error('Failed to load books:', err);
      setBooksError(err.message || 'Could not connect to book catalog');
      setBackendOnline(false);
    } finally {
      setBooksLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedAvailability]);

  // Fetch Dashboard Statistics
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await api.books.getStats();
      setStats(data);
      setBackendOnline(true);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Categories List
  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.books.getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);



  // Initial Data Load
  useEffect(() => {
    let active = true;

    async function init() {
      try {
        await api.health.check();
        if (active) setBackendOnline(true);
      } catch {
        if (active) setBackendOnline(false);
      }

      try {
        const statsData = await api.books.getStats();
        if (active) setStats(statsData);
      } catch (err) {
        console.error('Stats load error:', err);
      }

      try {
        const cats = await api.books.getCategories();
        if (active && Array.isArray(cats)) setCategories(cats);
      } catch (err) {
        console.error('Categories load error:', err);
      }
    }

    init();
    return () => {
      active = false;
    };
  }, []);

  // Fetch books when search or filter values change
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setBooksLoading(true);
      setBooksError('');
      try {
        const data = await api.books.getAll({
          search: searchQuery,
          category: selectedCategory,
          available: selectedAvailability
        });
        if (active) {
          setBooks(Array.isArray(data) ? data : []);
          setBackendOnline(true);
        }
      } catch (err) {
        if (active) {
          setBooksError(err.message || 'Could not connect to book catalog');
          setBackendOnline(false);
        }
      } finally {
        if (active) setBooksLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory, selectedAvailability]);

  // Auth Handlers
  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    showToast(`Welcome, ${authenticatedUser.name || 'Student'}! Logged in successfully.`);
    fetchStats();
    fetchBooks();
  };

  const handleLogout = () => {
    authStorage.clearSession();
    setUser(null);
    showToast('Signed out successfully.', 'info');
  };

  // Book Management Handlers
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setBookModalOpen(true);
  };

  const handleSaveBook = async (bookData) => {
    if (editingBook) {
      await api.books.update(editingBook.id, bookData);
      showToast(`Updated "${bookData.title}" successfully.`);
    } else {
      await api.books.create(bookData);
      showToast(`Added "${bookData.title}" to catalog.`);
    }
    fetchBooks();
    fetchStats();
    fetchCategories();
  };

  const handleOpenDelete = (id, title) => {
    setDeletingBookId(id);
    setDeletingBookTitle(title);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBookId) return;
    setDeleting(true);
    try {
      await api.books.delete(deletingBookId);
      showToast(`Deleted "${deletingBookTitle}" from catalog.`);
      setDeleteModalOpen(false);
      fetchBooks();
      fetchStats();
      fetchCategories();
    } catch (err) {
      showToast(err.message || 'Failed to delete book.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleAvailability = async (book) => {
    try {
      const updatedAvailability = !book.available;
      await api.books.update(book.id, {
        title: book.title,
        author: book.author,
        category: book.category,
        isbn: book.isbn,
        description: book.description,
        available: updatedAvailability
      });
      showToast(
        updatedAvailability
          ? `Marked "${book.title}" as Available.`
          : `Checked out "${book.title}".`
      );
      fetchBooks();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Could not update status.', 'error');
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenChat={() => setAiChatOpen(true)}
        onNavigate={(view) => setActiveView(view)}
        activeView={activeView}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeView === 'home' && (
          <>
            <HeroLanding
              onExploreCatalog={() => setActiveView('catalog')}
              onOpenChat={() => setAiChatOpen(true)}
              onOpenAuth={handleOpenAuth}
              user={user}
              stats={stats}
            />

            <section className="home-catalog-preview">
              <div className="section-header-row">
                <div>
                  <h2 className="section-title">Featured Library Publications</h2>
                  <p className="section-desc">Explore our curated collection of textbooks, research, and technical manuals.</p>
                </div>
                <button
                  className="btn-link-action"
                  onClick={() => setActiveView('catalog')}
                >
                  View All Books ({books.length}) →
                </button>
              </div>

              <BookCatalog
                books={books.slice(0, 6)}
                loading={booksLoading}
                error={booksError}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={setSelectedAvailability}
                onOpenAddBook={handleOpenAddBook}
                onEditBook={handleOpenEditBook}
                onDeleteBook={handleOpenDelete}
                onToggleAvailability={handleToggleAvailability}
                onRetry={fetchBooks}
                user={user}
              />
            </section>
          </>
        )}

        {activeView === 'catalog' && (
          <div className="view-container">
            <div className="view-header">
              <div>
                <h1 className="view-title">Academic Book Catalog</h1>
                <p className="view-subtitle">
                  Browse, search, and manage textbooks, journals, and reference materials.
                </p>
              </div>
            </div>

            <BookCatalog
              books={books}
              loading={booksLoading}
              error={booksError}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              selectedAvailability={selectedAvailability}
              onAvailabilityChange={setSelectedAvailability}
              onOpenAddBook={handleOpenAddBook}
              onEditBook={handleOpenEditBook}
              onDeleteBook={handleOpenDelete}
              onToggleAvailability={handleToggleAvailability}
              onRetry={fetchBooks}
              user={user}
            />
          </div>
        )}

        {activeView === 'dashboard' && (
          <div className="view-container">
            <DashboardStats
              user={user}
              stats={stats}
              loading={statsLoading}
              onRefresh={() => {
                fetchStats();
                fetchBooks();
              }}
              onOpenAddBook={handleOpenAddBook}
              onOpenChat={() => setAiChatOpen(true)}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveView('catalog');
              }}
            />

            <div className="dashboard-catalog-wrap">
              <h3 className="section-subtitle-heading">Recent Inventory</h3>
              <BookCatalog
                books={books}
                loading={booksLoading}
                error={booksError}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categories={categories}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={setSelectedAvailability}
                onOpenAddBook={handleOpenAddBook}
                onEditBook={handleOpenEditBook}
                onDeleteBook={handleOpenDelete}
                onToggleAvailability={handleToggleAvailability}
                onRetry={fetchBooks}
                user={user}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Quick Action Button for AI Assistant */}
      <button
        className="floating-ai-fab"
        onClick={() => setAiChatOpen(true)}
        title="Consult Athena AI Library Assistant"
      >
        <SparklesIcon className="icon-sm" />
        <span className="fab-label">Ask Athena</span>
        <span className="fab-pulse-ring" />
      </button>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      <AIAssistantModal
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />

      <BookModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
        onSave={handleSaveBook}
        editingBook={editingBook}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        bookTitle={deletingBookTitle}
        deleting={deleting}
      />

      {/* Global Footer */}
      <Footer
        onOpenChat={() => setAiChatOpen(true)}
        onNavigate={(view) => setActiveView(view)}
        backendOnline={backendOnline}
      />
    </div>
  );
}

export default App;