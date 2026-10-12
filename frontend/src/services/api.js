/**
 * AI Smart Library - Centralized API Service Module
 * Handles all HTTP communication with the backend REST endpoints.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

// Session Storage Utilities
export const authStorage = {
  getUser: () => {
    try {
      const stored = localStorage.getItem('sl_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
  getToken: () => {
    return localStorage.getItem('sl_token') || null;
  },
  setSession: (token, user) => {
    if (token) localStorage.setItem('sl_token', token);
    if (user) localStorage.setItem('sl_user', JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem('sl_token');
    localStorage.removeItem('sl_user');
  }
};

// Generic JSON fetch helper with error handling
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = authStorage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Parse JSON or text
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && data !== null && (data.message || data.error)) ||
        (typeof data === 'string' && data) ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const netError = new Error('Cannot connect to backend server. Make sure the Spring Boot backend is running on ' + BASE_URL);
      netError.status = 0;
      throw netError;
    }
    throw err;
  }
}

export const api = {
  baseUrl: BASE_URL,

  auth: {
    async register(name, email, password) {
      return request('/api/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
    },

    async login(email, password) {
      return request('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    async getProfile(email) {
      return request(`/api/users/profile?email=${encodeURIComponent(email)}`);
    }
  },

  books: {
    async getAll({ search, category, available } = {}) {
      const params = new URLSearchParams();
      if (search && search.trim()) params.append('query', search.trim());
      if (category && category !== 'All') params.append('category', category);
      if (available !== undefined && available !== null && available !== '') {
        params.append('available', String(available));
      }

      const queryString = params.toString();
      return request(`/api/books${queryString ? `?${queryString}` : ''}`);
    },

    async getById(id) {
      return request(`/api/books/${id}`);
    },

    async create(bookData) {
      return request('/api/books', {
        method: 'POST',
        body: JSON.stringify(bookData)
      });
    },

    async update(id, bookData) {
      return request(`/api/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bookData)
      });
    },

    async delete(id) {
      return request(`/api/books/${id}`, {
        method: 'DELETE'
      });
    },

    async getStats() {
      return request('/api/books/stats');
    },

    async getCategories() {
      return request('/api/books/categories');
    }
  },

  chat: {
    async sendMessage(message) {
      return request('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      });
    },

    async sendMessageGet(message) {
      return request(`/api/chat?message=${encodeURIComponent(message)}`);
    }
  },

  health: {
    async check() {
      return request('/api/hello');
    }
  }
};
