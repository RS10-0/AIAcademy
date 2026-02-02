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
    console.log("🚀 BotBuilder Version 2.0 Loaded (API Path: /api/chat)");
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
    e.preventDefault();
    if (!input.trim()) return;

    // Add User Message to UI
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // THE FIX: Ensure this matches your backend PORT and PATH exactly
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          personality: config.personality || "You are a helpful assistant."
        }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();

      // Add Bot Response to UI
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: data.reply || "I'm having trouble thinking right now." 
      }]);

    } catch (error) {
      console.error("Connection Error:", error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: "🚨 CONNECTION ERROR: Ensure 'node server.js' is running in your backend terminal!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6 h-[800px]">
      
      {/* Configuration Section */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Bot Configuration</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bot Name</label>
            <input
              type="text"
              name="botName"
              value={config.botName}
              onChange={handleConfigChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
              placeholder="e.g. Helpful Hal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
            <textarea
              name="personality"
              value={config.personality}
              onChange={handleConfigChange}
              className="w-full p-2 border rounded h-20 focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
              placeholder="e.g. You are a sarcastic assistant..."
            />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
          <span className="font-semibold text-gray-700">Live Preview: {config.botName || 'AI Bot'}</span>
          <button onClick={handleClearChat} className="text-sm text-red-500 hover:text-red-700 font-medium">Reset Chat</button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">Type a message below to test your bot!</div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : msg.role === 'system'
                  ? 'bg-red-50 text-red-600 text-xs border border-red-200 rounded-lg'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-500 text-sm p-2 rounded-lg italic animate-pulse">
                Bot is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
          <input
            className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500 text-black bg-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input}
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BotBuilder;