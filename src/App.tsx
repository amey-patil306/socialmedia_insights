import React from 'react';
import { Activity } from 'lucide-react';
import { ChatBot } from './components/ChatBot';
import { DataVisualizer } from './components/DataVisualizer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-gray-900">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Main Content */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Activity className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Social Media Insights
            </h1>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ChatBot />
            <DataVisualizer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;