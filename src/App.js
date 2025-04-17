import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import ChatPage from './components/pages/ChatPage';
import { ChatProvider } from './context/ChatContext';
import './App.css';

function App() {
  return (
    <ChatProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </ChatProvider>
  );
}

export default App;
