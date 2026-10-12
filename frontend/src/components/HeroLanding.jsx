import React from 'react';
import { BookIcon, SparklesIcon, SearchIcon, CheckIcon } from './Icons';

export default function HeroLanding({ onExploreCatalog, onOpenChat, onOpenAuth, user, stats }) {
  return (
    <div className="hero-landing">
      {/* Hero Header */}
      <section className="hero-banner">
        <div className="hero-badge">
          <SparklesIcon className="icon-xs" />
          <span>Intelligent Catalog & AI Assistant Integrated</span>
        </div>

        <h1 className="hero-title">
          Intelligent Academic Library Management
        </h1>

        <p className="hero-subtitle">
          Discover textbooks, research materials, and programming guides with an AI assistant that knows the real-time library catalog.
        </p>

        <div className="hero-cta-group">
          <button className="btn-hero-primary" onClick={onExploreCatalog}>
            <SearchIcon className="icon-sm" />
            <span>Browse Catalog</span>
          </button>

          <button className="btn-hero-ai" onClick={onOpenChat}>
            <SparklesIcon className="icon-sm" />
            <span>Ask AI Assistant</span>
          </button>

          {!user && (
            <button className="btn-hero-outline" onClick={() => onOpenAuth('login')}>
              <span>Student Portal</span>
            </button>
          )}
        </div>

        {/* Live Metrics Bar */}
        <div className="hero-metrics-bar">
          <div className="metric-item">
            <span className="metric-number">{stats ? stats.totalBooks : '7+'}</span>
            <span className="metric-label">Books Cataloged</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">{stats ? stats.availableBooks : '5+'}</span>
            <span className="metric-label">Available for Loan</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">{stats ? stats.totalCategories : '5'}</span>
            <span className="metric-label">Academic Categories</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-number">24/7</span>
            <span className="metric-label">AI Study Assistant</span>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-eyebrow">Platform Capabilities</span>
          <h2 className="section-title">Designed for Modern Academic Research</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box navy">
              <BookIcon className="icon-md" />
            </div>
            <h3>Smart Catalog & Availability</h3>
            <p>
              Instantly search through books by title, author, or discipline. Filter by availability and check real-time stock status before visiting the physical library.
            </p>
            <ul className="feature-bullets">
              <li><CheckIcon className="icon-xs text-emerald" /> Real-time availability tracking</li>
              <li><CheckIcon className="icon-xs text-emerald" /> Category & keyword filtering</li>
              <li><CheckIcon className="icon-xs text-emerald" /> Detailed ISBN & catalog metadata</li>
            </ul>
          </div>

          <div className="feature-card highlighted">
            <div className="feature-icon-box teal">
              <SparklesIcon className="icon-md" />
            </div>
            <div className="badge-ai-pill">Athena Assistant</div>
            <h3>AI Research Assistant</h3>
            <p>
              Directly integrated with the library database. Ask for tailored study plans, book recommendations based on live stock, and topic explanations.
            </p>
            <ul className="feature-bullets">
              <li><CheckIcon className="icon-xs text-emerald" /> Context-aware catalog recommendations</li>
              <li><CheckIcon className="icon-xs text-emerald" /> Concept breakdowns & study plans</li>
              <li><CheckIcon className="icon-xs text-emerald" /> Resilient fallback responses</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box slate">
              <SearchIcon className="icon-md" />
            </div>
            <h3>Student & Staff Dashboard</h3>
            <p>
              Personalized student accounts with BCrypt-hashed security and session tokens. Librarians can manage inventory, add new publications, and update book availability.
            </p>
            <ul className="feature-bullets">
              <li><CheckIcon className="icon-xs text-emerald" /> Secure student registration & login</li>
              <li><CheckIcon className="icon-xs text-emerald" /> Live inventory breakdown metrics</li>
              <li><CheckIcon className="icon-xs text-emerald" /> Administrative book management</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
