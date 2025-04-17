import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import GraphVisualizer from './components/GraphVisualizer.jsx'
import SlidingWindowVisualizer from './components/SlidingWindowVisualizer.jsx'
import SortingVisualizer from './components/SortingVisualizer.jsx'
import TreeVisualizer from './components/TreeVisualizer.jsx'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graph" element={<GraphVisualizer />} />
          <Route path="/sliding-window" element={<SlidingWindowVisualizer />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/tree" element={<TreeVisualizer />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
