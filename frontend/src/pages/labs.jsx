// src/pages/labs.jsx
import React from 'react';
import BotBuilder from '../components/BotBuilder'; // Importing the component you just made

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Labs</h1>
          <p className="text-gray-600">Experimenting with AI Bot Configurations</p>
        </header>

        {/* The Bot Builder Component */}
        <BotBuilder />
      
      </div>
    </div>
  );
}
