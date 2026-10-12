import React from 'react';
import { BookIcon, SparklesIcon } from './Icons';

export default function Footer({ onOpenChat, onNavigate, backendOnline }) {
  return (
    <footer className="library-footer">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="brand-logo-box sm">
              <BookIcon className="brand-icon" />
            </div>
            <span className="footer-brand-title">SmartLibrary</span>
          </div>
          <p className="footer-desc">
            An intelligent, AI-assisted library management system uniting Spring Boot, React, and Google Gemini to streamline textbook discovery and research.
          </p>
          <div className="footer-status-badge">
            <span className={`status-indicator-dot ${backendOnline ? 'online' : 'offline'}`} />
            <span>Backend API: {backendOnline ? 'Connected' : 'Offline / Checking...'}</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><button onClick={() => onNavigate('home')}>Home</button></li>
            <li><button onClick={() => onNavigate('catalog')}>Book Catalog</button></li>
            <li><button onClick={() => onNavigate('dashboard')}>Dashboard</button></li>
            <li><button onClick={onOpenChat}>AI Research Assistant</button></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Technologies</h4>
          <ul className="footer-links">
            <li><span>Java 21 & Spring Boot 4</span></li>
            <li><span>Spring AI & Google Gemini</span></li>
            <li><span>Spring Data JPA & Relational DB</span></li>
            <li><span>React 19 & Vite 8</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">AI Assistant</h4>
          <p className="footer-assistant-text">
            Meet Athena, your AI academic helper. Ask questions about syllabi, textbook availability, and coding tutorials.
          </p>
          <button className="btn-footer-chat" onClick={onOpenChat}>
            <SparklesIcon className="icon-xs" />
            <span>Launch Athena</span>
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AI-Assisted Smart Library Management System. All rights reserved.</p>
        <p className="footer-subtext">Designed for Academic Excellence & Research.</p>
      </div>
    </footer>
  );
}
