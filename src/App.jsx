import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import Subjects from './pages/Subjects';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import './styles/index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
