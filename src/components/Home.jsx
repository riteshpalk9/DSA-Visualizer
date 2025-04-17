import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="page-container home-container">
      <h1>Welcome to the DSA Visualizer</h1>
      <p className="intro">
        Explore interactive visualizations for Data Structures and Algorithms.
      </p>
      <div className="card-grid">
        <Link to="/graph" className="card">
          <h2>Graph Traversal</h2>
          <p>
            Dive into BFS and DFS with interactive graph animations that bring algorithms to life.
          </p>
        </Link>
        <Link to="/sliding-window" className="card">
          <h2>Sliding Window</h2>
          <p>
            Understand sliding window techniques with real-time visual guides.
          </p>
        </Link>
        <Link to="/sorting" className="card">
          <h2>Sorting Algorithms</h2>
          <p>
            Watch Bubble, Insertion, Selection, Merge, and Quick Sort in action with dynamic animations.
          </p>
        </Link>
        <Link to="/tree" className="card">
          <h2>Tree Structures</h2>
          <p>
            Build and interact with binary search trees and see traversals come to life.
          </p>
        </Link>
      </div>
    </div>
  )
}

export default Home
