import React, { useState, useEffect } from 'react';
import { FloatButton, Input, Button } from 'antd';
import botGif from '../assets/ChatBot.gif';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false); 

  const handleToggle = () => {
    if (isOpen) {
      setIsVisible(false);
      setTimeout(() => setIsOpen(false), 300);
    } else {
      setIsOpen(true);
      setTimeout(() => setIsVisible(true), 10);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to format text with proper line breaks and preserve formatting
  const formatBotResponse = (text) => {
    if (!text) return text;
    
    // Split by newlines and create JSX elements
    return text.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const currentInput = input.trim(); 
    const userMessage = { role: 'user', text: currentInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/chatbot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: currentInput }),
    })
      .then((res) => {
        console.log('Response status:', res.status); 
        return res.json();
      })
      .then((data) => {
        console.log('Response data:', data); 
        setTimeout(() => {
          const botText = data.reply || data.answer || 'Sorry, I could not process your request.';
          setMessages((prev) => [...prev, { 
            role: 'bot', 
            text: botText,
            sources: data.sources || [],
            intent: data.intent || 'unknown',
            resultsCount: data.results_count || 0
          }]);
          setTyping(false);
        }, 1000); // Reduced typing delay for better UX
      })
      .catch((error) => {
        console.error('Chatbot error:', error); 
        setTimeout(() => {
          setMessages((prev) => [...prev, { 
            role: 'bot', 
            text: 'Oops! Something went wrong. Please check the console for details.',
            isError: true
          }]);
          setTyping(false);
        }, 1000);
      });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ 
        role: 'bot', 
        text: "Hi! How can I help you today? 😊\n\nYou can ask me about:\n• Tasks and their progress\n• Forum posts and discussions\n• Team members and assignments" 
      }]);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chatbot Button */}
      <div
        onClick={handleToggle}
        className="chatbot-button"
        title="Talk to Mindverse Assistant 🤖"
      >
        <img
          src={botGif}
          alt="Chatbot Button"
          className="chatbot-button-image"
        />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="chatbot-backdrop"
          onClick={handleToggle}
        />
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="chatbot-modal">
          {/* Header */}
          <div className="chatbot-header">
            Mindverse Assistant
            <span
              className="chatbot-close"
              onClick={handleToggle}
            >
              ✕
            </span>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message-container ${msg.role}`}
              >
                <div className={`message-bubble ${msg.role} ${msg.isError ? 'error' : ''}`}>
                  {msg.role === 'bot' ? formatBotResponse(msg.text) : msg.text}
                </div>
                
                {/* Show sources and metadata if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="message-metadata">
                     Sources: {msg.sources.join(', ')}
                    {msg.resultsCount > 0 && ` • ${msg.resultsCount} results found`}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {typing && (
              <div className="message-container bot">
                <div className="message-bubble bot typing">
                  <span className="typing-dots">typing</span>...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chatbot-input-container">
            <Input.Group compact>
              <Input
                className="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress} 
                placeholder="Ask about tasks, posts, users..."
                disabled={typing}
              />
              <Button
                className="chatbot-send-button"
                onClick={handleSend}
                disabled={typing}
              >
                Send
              </Button>
            </Input.Group>
          </div>
        </div>
      )}

      {/* Responsive CSS */}
      <style jsx>{`
        /* Chatbot Button */
        .chatbot-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 70px;
          height: 70px;
          cursor: pointer;
          z-index: 1001;
          transform: ${isOpen ? 'scale(0.9)' : 'scale(1)'};
          transition: transform 0.2s ease;
        }

        .chatbot-button-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: box-shadow 0.3s ease;
        }

        /* Backdrop */
        .chatbot-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.1);
          z-index: 999;
          opacity: ${isVisible ? 1 : 0};
          transition: opacity 0.3s ease;
          pointer-events: ${isVisible ? 'auto' : 'none'};
        }

        /* Chat Modal */
        .chatbot-modal {
          position: fixed;
          right: 24px;
          bottom: 110px;
          width: 420px;
          max-height: 75vh;
          background-color: #fff;
          border-radius: 16px;
          box-shadow: ${isVisible 
            ? '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)' 
            : '0 4px 12px rgba(0, 0, 0, 0.2)'};
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          opacity: ${isVisible ? 1 : 0};
          transform: ${isVisible 
            ? 'translateY(0) scale(1)' 
            : 'translateY(20px) scale(0.95)'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: ${isVisible ? 'auto' : 'none'};
          transform-origin: bottom right;
        }

        /* Header */
        .chatbot-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, #8F1383, #202060);
          color: #FFFFFF;
          font-weight: 600;
          font-size: 16px;
          border-radius: 16px 16px 0 0;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .chatbot-close {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s ease;
          font-size: 18px;
          line-height: 1;
        }

        .chatbot-close:hover {
          background-color: rgba(255,255,255,0.1);
        }

        /* Messages */
        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background-color: #fafbfc;
          min-height: 250px;
          max-height: calc(75vh - 140px);
        }

        .message-container {
          margin-bottom: 14px;
          animation: messageSlideIn 0.4s ease-out both;
        }

        .message-container.user {
          text-align: right;
        }

        .message-container.bot {
          text-align: left;
        }

        .message-bubble {
          display: inline-block;
          padding: 12px 16px;
          max-width: 85%;
          word-wrap: break-word;
          font-size: 14px;
          line-height: 1.5;
          text-align: left;
        }

        .message-bubble.user {
          background-color: #432E54;
          color: #fff;
          border-radius: 18px 18px 4px 18px;
          box-shadow: 0 2px 8px rgba(67, 46, 84, 0.2);
        }

        .message-bubble.bot {
          background-color: #ffffff;
          color: #333;
          border-radius: 18px 18px 18px 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
        }

        .message-bubble.bot.error {
          background-color: #ff4d4f;
          color: #fff;
          border: none;
        }

        .message-bubble.bot.typing {
          background-color: #e5e7eb;
          color: #666;
          border: 1px solid #e5e7eb;
        }

        .message-metadata {
          font-size: 11px;
          color: #666;
          margin-top: 6px;
          text-align: left;
        }

        /* Input */
        .chatbot-input-container {
          padding: 12px 16px 16px;
          border-top: 1px solid #e5e7eb;
          background-color: #fff;
          border-radius: 0 0 16px 16px;
        }

        .chatbot-input {
          width: calc(100% - 70px) !important;
          border-radius: 22px 0 0 22px !important;
          border: 1px solid #d1d5db !important;
          font-size: 14px !important;
          padding: 10px 14px !important;
          height: 36px !important;
        }

        .chatbot-send-button {
          background-color: #1f1c3a !important;
          border-color: #1f1c3a !important;
          color: #fff !important;
          border-radius: 0 22px 22px 0 !important;
          font-weight: 500 !important;
          height: 36px !important;
          transition: all 0.2s ease !important;
          border: 1px solid #1f1c3a !important;
        }

        .chatbot-send-button:hover {
          background-color: #2c275a !important;
          transform: translateY(-1px) !important;
        }

        /* Animations */
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Typing animation */
        .typing-dots {
          animation: typingDots 1.4s infinite;
        }

        @keyframes typingDots {
          0%, 60%, 100% {
            opacity: 1;
          }
          30% {
            opacity: 0.7;
          }
        }

        /* Scrollbar styling */
        .chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .chatbot-button {
            bottom: 20px;
            right: 20px;
            width: 65px;
            height: 65px;
          }

          .chatbot-modal {
            right: 20px;
            bottom: 100px;
            width: 380px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .chatbot-button {
            bottom: 16px;
            right: 16px;
            width: 60px;
            height: 60px;
          }

          .chatbot-modal {
            right: 16px;
            bottom: 90px;
            width: 320px;
            max-height: 70vh;
          }

          .chatbot-header {
            padding: 14px 16px;
            font-size: 15px;
          }

          .chatbot-close {
            right: 12px;
            width: 20px;
            height: 20px;
            font-size: 16px;
          }

          .chatbot-messages {
            padding: 12px;
            min-height: 200px;
            max-height: calc(70vh - 120px);
          }

          .message-bubble {
            padding: 10px 14px;
            font-size: 13px;
            max-width: 90%;
          }

          .chatbot-input-container {
            padding: 10px 12px 12px;
          }

          .chatbot-input {
            font-size: 13px !important;
            padding: 8px 12px !important;
            height: 34px !important;
          }

          .chatbot-send-button {
            height: 34px !important;
            font-size: 13px !important;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .chatbot-button {
            bottom: 12px;
            right: 12px;
            width: 55px;
            height: 55px;
          }

          .chatbot-modal {
            right: 8px;
            bottom: 80px;
            width: calc(100vw - 16px);
            max-width: 300px;
            max-height: 65vh;
          }

          .chatbot-header {
            padding: 12px 14px;
            font-size: 14px;
          }

          .chatbot-messages {
            padding: 10px;
            min-height: 180px;
            max-height: calc(65vh - 110px);
          }

          .message-bubble {
            padding: 8px 12px;
            font-size: 12px;
            max-width: 95%;
          }

          .message-metadata {
            font-size: 10px;
          }

          .chatbot-input-container {
            padding: 8px 10px 10px;
          }

          .chatbot-input {
            font-size: 12px !important;
            padding: 6px 10px !important;
            height: 32px !important;
            width: calc(100% - 60px) !important;
          }

          .chatbot-send-button {
            height: 32px !important;
            font-size: 12px !important;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .chatbot-button {
            width: 50px;
            height: 50px;
            bottom: 10px;
            right: 10px;
          }

          .chatbot-modal {
            right: 4px;
            bottom: 70px;
            width: calc(100vw - 8px);
            max-height: 60vh;
          }

          .chatbot-header {
            padding: 10px 12px;
            font-size: 13px;
          }

          .chatbot-messages {
            padding: 8px;
            min-height: 160px;
          }

          .message-bubble {
            padding: 6px 10px;
            font-size: 11px;
          }
        }

        /* Landscape Mobile */
        @media (max-height: 500px) and (orientation: landscape) {
          .chatbot-modal {
            max-height: 85vh;
            bottom: 60px;
          }

          .chatbot-messages {
            min-height: 120px;
            max-height: calc(85vh - 100px);
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .chatbot-button {
            width: 65px;
            height: 65px;
          }

          .chatbot-close {
            width: 28px;
            height: 28px;
            font-size: 18px;
          }

          .chatbot-input {
            height: 38px !important;
            font-size: 16px !important; /* Prevents zoom on iOS */
          }

          .chatbot-send-button {
            height: 38px !important;
            min-width: 60px !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .chatbot-modal {
            border: 2px solid #000;
          }

          .message-bubble.bot {
            border: 1px solid #000;
          }

          .message-bubble.user {
            background-color: #000;
            border: 1px solid #000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .chatbot-button {
            transition: none;
          }

          .chatbot-modal {
            transition: opacity 0.2s ease;
            transform: none !important;
          }

          .message-container {
            animation: none;
          }

          .typing-dots {
            animation: none;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .chatbot-messages {
            background-color: #1a1a1a;
          }

          .message-bubble.bot {
            background-color: #2a2a2a;
            color: #fff;
            border-color: #404040;
          }

          .chatbot-input-container {
            background-color: #2a2a2a;
            border-top-color: #404040;
          }

          .chatbot-input {
            background-color: #1a1a1a !important;
            color: #fff !important;
            border-color: #404040 !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;