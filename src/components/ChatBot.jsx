import React, { useState, useEffect } from 'react';
import { FloatButton, Input, Button } from 'antd';
import botGif from '../assets/ChatBot.gif';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [setTyping] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      setIsVisible(false);
      setTimeout(() => setIsOpen(false), 300);
    } else {
      setIsOpen(true);
      setTimeout(() => setIsVisible(true), 10);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
          setTyping(false);
        }, 1500);
      })
      .catch(() => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'bot', text: 'Oops! Something went wrong.' }]);
          setTyping(false);
        }, 1000);
      });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'bot', text: "Hi! How can I help you today? 😊" }]);
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
            width: 400,
            maxHeight: '70vh',
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
              minHeight: '200px',
              maxHeight: 'calc(70vh - 140px)',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{ 
                  textAlign: msg.role === 'user' ? 'right' : 'left', 
                  marginBottom: 12,
                  animation: `messageSlideIn 0.4s ease-out ${i * 0.1}s both`,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: msg.role === 'user' ? '#432E54' : '#ffffff',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    boxShadow: msg.role === 'user' 
                      ? '0 2px 8px rgba(67, 46, 84, 0.2)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: msg.role === 'bot' ? '1px solid #e5e7eb' : 'none',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
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
                  borderRadius: '20px 0 0 20px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  padding: '8px 12px',
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Type a message..."
              />
              <Button
                style={{
                  backgroundColor: '#1f1c3a',
                  borderColor: '#1f1c3a',
                  color: '#fff',
                  borderRadius: '0 20px 20px 0',
                  fontWeight: '500',
                  height: '32px',
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

        /* Scrollbar styling */
        div::-webkit-scrollbar {
          width: 4px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 2px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default ChatBot;