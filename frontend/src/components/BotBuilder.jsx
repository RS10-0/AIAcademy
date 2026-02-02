import React, { useState, useEffect, useRef } from 'react';

const BotBuilder = () => {
  // 1. State for Bot Configuration
  const [config, setConfig] = useState({
    botName: '',
    personality: ''
  });
  
  // 2. State for Chat and UI
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-scroll reference
  const chatEndRef = useRef(null);

  // --- Local Storage Logic (Persistence) ---
  useEffect(() => {
    console.log("🚀 BotBuilder Component Mounted");
    const savedConfig = localStorage.getItem('botBuilder_config');
    const savedMessages = localStorage.getItem('botBuilder_messages');
    
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    localStorage.setItem('botBuilder_config', JSON.stringify(config));
    localStorage.setItem('botBuilder_messages', JSON.stringify(messages));
  }, [config, messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Handlers ---
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleClearChat = () => {
    if (window.confirm("Clear chat history?")) {
      setMessages([]);
      localStorage.removeItem('botBuilder_messages');
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    
    // Safety check: Don't send if empty or already loading
    if (!input.trim() || isLoading) return;

    console.log("📤 Sending message:", input);

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 🚨 ATTEMPTING BACKEND CONNECTION 🚨
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          personality: config.personality || "You are a helpful assistant."
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Received from backend:", data);

      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.reply 
      }]);

    } catch (error) {
      console.error("❌ Connection Error:", error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `🚨 ERROR: Could not connect to backend. Is 'node server.js' running? (${error.message})` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6 h-[800px] text-slate-900">
      
      {/* Configuration Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Bot Configuration</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Bot Name</label>
            <input
              type="text"
              name="botName"
              value={config.botName}
              onChange={handleConfigChange}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
              placeholder="e.g. Helpful Hal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Personality Prompt</label>
            <textarea
              name="personality"
              value={config.personality}
              onChange={handleConfigChange}
              className="w-full p-2 border border-slate-300 rounded h-20 focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
              placeholder="e.g. You are a sarcastic pirate who loves coding..."
            />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-3 bg-slate-50 border-b flex justify-between items-center">
          <span className="font-semibold text-slate-700">
            Live Preview: <span className="text-cyan-600">{config.botName || 'AI Bot'}</span>
          </span>
          <button onClick={handleClearChat} className="text-sm text-red-500 hover:text-red-700 font-medium">
            Clear Chat
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <p className="text-center text-slate-400 mt-10 text-sm italic">Initialize your bot and say hello!</p>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-cyan-500 text-white rounded-br-none' 
                  : msg.role === 'system'
                  ? 'bg-red-50 text-red-600 text-xs border border-red-100 italic'
                  : 'bg-slate-200 text-slate-800 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-400 text-sm p-3 rounded-lg animate-pulse">
                {config.botName || 'Bot'} is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
          <input
            className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:border-cyan-500 bg-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={false}
            className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BotBuilder;