import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import axios from 'axios';

// Create axios instance with base URL and CORS configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', {
        message: input
      });

      if (response.data.success) {
        const botMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.message,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (error) {
      // Safe error logging that avoids Symbol() serialization issues
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error in chat request:', errorMessage);
      
      const botErrorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please ensure the Flask server is running on port 3000.',
      };
      setMessages((prev) => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900/50 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-4 border-b border-cyan-500/30">
        <Bot className="w-6 h-6 text-cyan-400" />
        <h2 className="text-lg font-semibold text-cyan-400">Social Media Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-cyan-500/20 text-cyan-100'
                  : 'bg-purple-500/20 text-purple-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-purple-500/20 text-purple-100">
              <div className="flex gap-2">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce delay-100">●</div>
                <div className="animate-bounce delay-200">●</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-cyan-500/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-gray-800/50 text-white rounded-lg px-4 py-2 border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
            placeholder="Ask about your social media strategy..."
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={`p-2 ${
              isLoading
                ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
            } rounded-lg transition-colors`}
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}