import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatButton() {
  const navigate = useNavigate();

  return (
    <button 
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-[52px] md:h-[52px] rounded-lg bg-accent text-accent-text-on flex items-center justify-center text-2xl shadow-[0_4px_16px_rgba(255,210,63,0.3)] transition-all duration-200 hover:scale-105 hover:shadow-[0_6px_24px_rgba(255,210,63,0.4)] active:scale-95 z-50"
      onClick={() => navigate('/chat')}
      aria-label="Open Swastik AI Chat"
    >
      <span className="ti ti-message-circle text-2xl"></span>
    </button>
  );
}

export default ChatButton;