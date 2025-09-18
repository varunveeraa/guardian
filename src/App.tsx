import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { HomePage } from './pages/HomePage';
import { PreventionPage } from './pages/PreventionPage';
import { TutorialsPage } from './pages/TutorialsPage';
import { SupportPage } from './pages/SupportPage';

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-800 flex flex-col">
          <AccessibilityToolbar />
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prevention" element={<PreventionPage />} />
              <Route path="/tutorials" element={<TutorialsPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;