import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css' // Optionally create component-specific styles


const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>DSA Visualizer</h2>
      <div>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/graph">Graph Traversal</NavLink>
        <NavLink to="/sliding-window">Sliding Window</NavLink>
        <NavLink to="/sorting">Sorting</NavLink>
        <NavLink to="/tree">Tree</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
