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

    fetch("http://localhost:3000/chatbot/chat", {
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
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 70,
          height: 70,
          cursor: 'pointer',
          zIndex: 1001,
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
        title="Talk to Mindverse Assistant 🤖"
      >
        <img
          src={botGif}
          alt="Chatbot Button"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.3s ease',
          }}
        />
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 999,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: isVisible ? 'auto' : 'none',
          }}
          onClick={handleToggle}
        />
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 110,
            width: 420, // Slightly wider for better readability
            maxHeight: '75vh', // Slightly taller
            backgroundColor: '#fff',
            borderRadius: 16,
            boxShadow: isVisible 
              ? '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)' 
              : '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            opacity: isVisible ? 1 : 0,
            transform: isVisible 
              ? 'translateY(0) scale(1)' 
              : 'translateY(20px) scale(0.95)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: isVisible ? 'auto' : 'none',
            transformOrigin: 'bottom right',
          }}
        >
          {/* Header */}
          <div 
            style={{ 
              padding: '16px 20px', 
              background: 'linear-gradient(135deg, #8F1383, #202060)', 
              color: '#FFFFFF', 
              fontWeight: '600', 
              fontSize: '16px',
              borderRadius: '16px 16px 0 0',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            Mindverse Assistant
            <span
              style={{ 
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease',
                fontSize: '18px',
                lineHeight: 1,
              }}
              onClick={handleToggle}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              ✕
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              backgroundColor: '#fafbfc',
              minHeight: '250px',
              maxHeight: 'calc(75vh - 140px)',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{ 
                  textAlign: msg.role === 'user' ? 'right' : 'left', 
                  marginBottom: 14,
                  animation: `messageSlideIn 0.4s ease-out ${i * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: msg.role === 'user' ? '#432E54' : (msg.isError ? '#ff4d4f' : '#ffffff'),
                    color: msg.role === 'user' ? '#fff' : (msg.isError ? '#fff' : '#333'),
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    maxWidth: '85%',
                    wordWrap: 'break-word',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    boxShadow: msg.role === 'user' 
                      ? '0 2px 8px rgba(67, 46, 84, 0.2)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: msg.role === 'bot' && !msg.isError ? '1px solid #e5e7eb' : 'none',
                    textAlign: 'left', // Always left-align text content
                  }}
                >
                  {msg.role === 'bot' ? formatBotResponse(msg.text) : msg.text}
                </div>
                
                {/* Show sources and metadata if available */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#666', 
                    marginTop: 6,
                    textAlign: msg.role === 'user' ? 'right' : 'left'
                  }}>
                     Sources: {msg.sources.join(', ')}
                    {msg.resultsCount > 0 && ` • ${msg.resultsCount} results found`}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {typing && (
              <div style={{ textAlign: 'left', marginBottom: 8 }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#e5e7eb',
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  color: '#666',
                  fontSize: '14px',
                  border: '1px solid #e5e7eb',
                }}>
                  <span className="typing-dots">typing</span>...
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div 
            style={{ 
              padding: '12px 16px 16px', 
              borderTop: '1px solid #e5e7eb', 
              backgroundColor: '#fff',
              borderRadius: '0 0 16px 16px',
            }}
          >
            <Input.Group compact>
              <Input
                style={{ 
                  width: 'calc(100% - 70px)',
                  borderRadius: '22px 0 0 22px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  padding: '10px 14px',
                  height: '36px',
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress} 
                placeholder="Ask about tasks, posts, users..."
                disabled={typing}
              />
              <Button
                style={{
                  backgroundColor: '#1f1c3a',
                  borderColor: '#1f1c3a',
                  color: '#fff',
                  borderRadius: '0 22px 22px 0',
                  fontWeight: '500',
                  height: '36px',
                  transition: 'all 0.2s ease',
                  border: '1px solid #1f1c3a',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2c275a';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#1f1c3a';
                  e.target.style.transform = 'translateY(0)';
                }}
                onClick={handleSend}
                disabled={typing}
              >
                Send
              </Button>
            </Input.Group>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
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
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default ChatBot;