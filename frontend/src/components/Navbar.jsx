import React from 'react';
import { BookIcon, SparklesIcon, UserIcon } from './Icons';

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  onOpenChat,
  onNavigate,
  activeView
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => onNavigate('home')} role="button" tabIndex={0}>
          <div className="brand-logo-box">
            <BookIcon className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">SmartLibrary</span>
            <span className="brand-tag">AI Powered</span>
          </div>
        </div>

        <nav className="navbar-nav">
          <button
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeView === 'catalog' ? 'active' : ''}`}
            onClick={() => onNavigate('catalog')}
          >
            Book Catalog
          </button>
          <button
            className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </button>
          <button
            className="nav-link ai-nav-pill"
            onClick={onOpenChat}
            title="Open AI Library Assistant"
          >
            <SparklesIcon className="icon-sm" />
            <span>AI Assistant</span>
          </button>
        </nav>

        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-menu">
              <div className="user-info-pill">
                <div className="avatar-circle">
                  <UserIcon className="icon-sm" />
                </div>
                <div className="user-text">
                  <span className="user-name">{user.name || user.email}</span>
                  <span className={`user-badge ${user.role === 'ADMIN' ? 'badge-admin' : 'badge-student'}`}>
                    {user.role || 'STUDENT'}
                  </span>
                </div>
              </div>
              <button className="btn-logout" onClick={onLogout} title="Sign Out">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-ghost" onClick={() => onOpenAuth('login')}>
                Sign In
              </button>
              <button className="btn-primary-sm" onClick={() => onOpenAuth('register')}>
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
