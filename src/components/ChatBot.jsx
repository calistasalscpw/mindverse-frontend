import React, { useState, useEffect } from 'react';
import { FloatButton, Input, Button } from 'antd';
import botGif from '../assets/ChatBot.gif';


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [setTyping] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);

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
          }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            right: 24,
            bottom: 100,
            width: 400,
            maxHeight: '70vh',
            backgroundColor: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out', 
            opacity: 1,
            transform: 'translateY(0)', 
            animation: 'slideUp 0.3s ease-out', 
          }}
        >
          {/* Header */}
          <div style={{ padding: '12px 18px', background: 'linear-gradient(#8F1383, #202060)', color: '#FFFFFF', fontWeight: 'bold', fontSize: '16px' }}>
            Mindverse Assistant
            <span
              style={{ float: 'right', cursor: 'pointer' }}
              onClick={handleToggle}
            >
              ✕
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              backgroundColor: '#f9fafb',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{ textAlign: msg.role === 'user' ? 'right' : 'left', marginBottom: 8 }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: msg.role === 'user' ? '#432E54' : '#e5e7eb',
                    color: msg.role === 'user' ? '#fff' : '#000',
                    padding: '8px 12px',
                    borderRadius: 12,
                    maxWidth: '80%',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: 10, borderTop: '1px solid #eee', backgroundColor: '#fff' }}>
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 70px)' }}
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
                    transition: '0.3s',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#2c275a')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#1f1c3a')}
                onClick={handleSend}
                >
                Send
                </Button>

            </Input.Group>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;
