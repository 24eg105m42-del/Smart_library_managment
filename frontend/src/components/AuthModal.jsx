import React, { useState } from 'react';
import { CloseIcon, BookIcon, EyeIcon, EyeOffIcon, LockIcon, UserIcon } from './Icons';
import { api, authStorage } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    // Client-side validations
    if (!email.trim() || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    if (password.length < 4) {
      setMessage('Password must be at least 4 characters long.');
      setMessageType('error');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setMessage('Please enter your full name.');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const response = await api.auth.register(name, email, password);
        setMessage(response.message || 'Registration successful! Signing in...');
        setMessageType('success');

        if (response.token && response.user) {
          authStorage.setSession(response.token, response.user);
          setTimeout(() => {
            onAuthSuccess(response.user);
            onClose();
          }, 800);
        } else {
          // Fallback transition to login tab
          setTimeout(() => {
            setMode('login');
            setMessage('Registration successful. Please log in.');
          }, 1000);
        }
      } else {
        const response = await api.auth.login(email, password);
        setMessage(response.message || 'Login successful!');
        setMessageType('success');

        if (response.token && response.user) {
          authStorage.setSession(response.token, response.user);
        } else {
          // Fallback user object
          authStorage.setSession('sl-session-' + Date.now(), { email, name: email.split('@')[0], role: 'STUDENT' });
        }

        setTimeout(() => {
          onAuthSuccess(response.user || { email, name: email.split('@')[0], role: 'STUDENT' });
          onClose();
        }, 600);
      }
    } catch (err) {
      setMessage(err.message || 'Authentication failed. Please check credentials.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-logo-box sm">
              <BookIcon className="brand-icon" />
            </div>
            <div>
              <h3>{mode === 'login' ? 'Sign In to SmartLibrary' : 'Create Student Account'}</h3>
              <p className="modal-subtitle">Access real-time catalog, loans, and AI assistant</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <CloseIcon className="icon-sm" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleSwitchMode('register')}
          >
            Register Student
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`form-alert ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <UserIcon className="input-icon" />
                <input
                  type="text"
                  className="form-input with-left-icon"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Academic Email</label>
            <div className="input-with-icon">
              <span className="input-icon">@</span>
              <input
                type="email"
                className="form-input with-left-icon"
                placeholder="student@smartlibrary.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <LockIcon className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input with-left-icon with-right-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon className="icon-xs" /> : <EyeIcon className="icon-xs" />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="auth-hint-row">
              <span className="demo-credentials-hint">
                Demo Accounts: <code>sathwik@gmail.com / 1234</code> or <code>admin@smartlibrary.com / admin123</code>
              </span>
            </div>
          )}

          <div className="modal-actions full-width">
            <button
              type="submit"
              className="btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-flex">
                  <span className="spinner-sm" />
                  <span>{mode === 'login' ? 'Authenticating...' : 'Registering...'}</span>
                </span>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </div>
        </form>

        <div className="auth-modal-footer">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button type="button" className="link-button" onClick={() => handleSwitchMode('register')}>
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button type="button" className="link-button" onClick={() => handleSwitchMode('login')}>
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
