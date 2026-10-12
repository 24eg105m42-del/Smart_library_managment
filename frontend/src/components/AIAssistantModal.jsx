import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, CloseIcon, SendIcon, RefreshIcon } from './Icons';
import { api } from '../services/api';

const SUGGESTED_PROMPTS = [
  "Suggest books for learning Java.",
  "Which programming books are available?",
  "Help me choose a database book.",
  "Create a study plan for computer networks."
];

let globalMessageId = 100;
function createId() {
  globalMessageId += 1;
  return globalMessageId;
}

function getTimeString() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am Athena, your AI Smart Library Assistant. I'm connected to the real-time library inventory and powered by Google Gemini. Ask me about available textbooks, study plans, or specific subjects!",
      model: 'gemini-2.5-flash',
      time: 'Online'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg = {
      id: createId(),
      sender: 'user',
      text,
      time: getTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setError('');
    setLoading(true);

    try {
      const response = await api.chat.sendMessage(text);
      const assistantMsg = {
        id: createId(),
        sender: 'assistant',
        text: response.reply || 'No response generated.',
        model: response.model || 'gemini-2.5-flash',
        fallback: response.fallback,
        time: getTimeString()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err.message || 'Failed to communicate with AI service.');
      const errorMsg = {
        id: createId(),
        sender: 'assistant',
        text: `⚠️ Error: ${err.message || 'Unable to connect to AI assistant.'}. Please verify that the backend is running.`,
        isError: true,
        time: getTimeString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: createId(),
        sender: 'assistant',
        text: "Conversation cleared. How else may I assist you with the library catalog or your studies?",
        model: 'gemini-2.5-flash',
        time: getTimeString()
      }
    ]);
  };

  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div className="ai-drawer-card" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="ai-drawer-header">
          <div className="ai-header-brand">
            <div className="ai-avatar-sparkle">
              <SparklesIcon className="icon-sm" />
            </div>
            <div>
              <h3 className="ai-name">Athena AI Assistant</h3>
              <span className="ai-status-indicator">
                <span className="status-dot-pulse" />
                <span>Connected to Library Catalog</span>
              </span>
            </div>
          </div>
          <div className="ai-header-controls">
            <button className="btn-icon-ghost" onClick={handleClearChat} title="Clear conversation">
              <RefreshIcon className="icon-xs" />
            </button>
            <button className="btn-icon-ghost" onClick={onClose} title="Close assistant">
              <CloseIcon className="icon-sm" />
            </button>
          </div>
        </div>

        {/* Suggested Prompts Pill Bar */}
        <div className="ai-suggested-prompts-bar">
          <span className="suggested-label">Suggested:</span>
          <div className="suggested-pills-scroll">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="suggested-pill"
                onClick={() => handleSend(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Message List */}
        <div className="ai-messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'assistant-row'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="assistant-bubble-avatar">
                  <SparklesIcon className="icon-xs" />
                </div>
              )}
              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'assistant-bubble'} ${msg.isError ? 'error-bubble' : ''}`}>
                <div className="bubble-text">{msg.text}</div>
                <div className="bubble-meta">
                  <span className="bubble-time">{msg.time}</span>
                  {msg.model && (
                    <span className="bubble-model-tag">
                      {msg.model}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-row assistant-row">
              <div className="assistant-bubble-avatar">
                <SparklesIcon className="icon-xs" />
              </div>
              <div className="chat-bubble assistant-bubble loading-bubble">
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="typing-text">Athena is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Footer */}
        <div className="ai-drawer-footer">
          {error && <div className="ai-input-error">{error}</div>}
          <div className="ai-input-wrapper">
            <textarea
              ref={textareaRef}
              rows={2}
              className="ai-chat-textarea"
              placeholder="Ask Athena about books, availability, or study roadmaps (Press Enter to send)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="ai-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !inputText.trim()}
              title="Send Message"
            >
              <SendIcon className="icon-sm" />
            </button>
          </div>
          <div className="ai-footer-hint">
            <span>Spring AI + Gemini 2.5 Flash • Context: Real-time Database Catalog</span>
          </div>
        </div>
      </div>
    </div>
  );
}
