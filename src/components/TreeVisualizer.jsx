import React, { useState, useRef, useEffect } from 'react'

// --- BST helper functions ---
function insertBST(root, value) {
  if (root === null) return { value, left: null, right: null }
  if (value < root.value) {
    root.left = insertBST(root.left, value)
  } else {
    root.right = insertBST(root.right, value)
  }
  return root
}

function buildBST(values) {
  let root = null
  values.forEach(v => {
    const num = Number(v)
    if (!isNaN(num)) {
      root = insertBST(root, num)
    }
  })
  return root
}

let currentX = 0
function assignPositions(node, depth) {
  if (!node) return
  assignPositions(node.left, depth + 1)
  node.x = currentX * 60 + 50   // Horizontal spacing
  node.y = depth * 70 + 50      // Vertical spacing
  currentX++
  assignPositions(node.right, depth + 1)
}

function getEdges(node) {
  let edges = []
  function traverse(n) {
    if (!n) return
    if (n.left) {
      edges.push({ x1: n.x, y1: n.y, x2: n.left.x, y2: n.left.y })
      traverse(n.left)
    }
    if (n.right) {
      edges.push({ x1: n.x, y1: n.y, x2: n.right.x, y2: n.right.y })
      traverse(n.right)
    }
  }
  traverse(node)
  return edges
}

function getNodes(node) {
  let nodes = []
  function traverse(n) {
    if (!n) return
    nodes.push(n)
    traverse(n.left)
    traverse(n.right)
  }
  traverse(node)
  return nodes
}

// --- TreeVisualizer Component ---
const TreeVisualizer = () => {
  const [inputValue, setInputValue] = useState('')
  const [bst, setBst] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [offsetX, setOffsetX] = useState(0)
  const treeRef = useRef(null)

  const handleCreateTree = () => {
    // Parse the input into numeric values
    const arr = inputValue.split(" ").filter(item => !isNaN(item) && item.trim() !== "")
    // Build BST and assign positions
    const tree = buildBST(arr)
    currentX = 0
    assignPositions(tree, 0)
    const nodesArr = getNodes(tree)
    const edgesArr = getEdges(tree)
    // Compute horizontal offset
    const xs = nodesArr.map(n => n.x)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const treeWidth = maxX - minX
    const svgWidth = 1000  // Fixed width for the SVG element
    const shift = (svgWidth - treeWidth) / 2 - minX
    setOffsetX(shift)
    setBst(tree)
    setNodes(nodesArr)
    setEdges(edgesArr)
  }

  useEffect(() => {
    // Optionally add pan/zoom listeners using treeRef if needed.
  }, [])

  return (
    <div className="page-container">
      <h1>Tree Visualizer</h1>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Enter numbers separated by space"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleCreateTree}>Create Tree</button>
      </div>
      <div
        id="tree"
        ref={treeRef}
        style={{
          width: '100%',
          height: '500px',
          overflow: 'auto',
          backgroundColor: '#444',
          padding: '10px',
          borderRadius: '10px'
        }}
      >
        {bst ? (
          <svg width="1000" height="500" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
            {/* Wrap tree elements in a group that shifts horizontally */}
            <g transform={`translate(${offsetX}, 0)`}>
              {edges.map((edge, idx) => (
                <line
                  key={idx}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="#61dafb"
                  strokeWidth="2"
                />
              ))}
              {nodes.map((node, idx) => (
                <g key={idx} transform={`translate(${node.x}, ${node.y})`}>
                  <circle r="20" fill="#61dafb" />
                  <text x="-8" y="5" fill="#fff" fontSize="12">
                    {node.value}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        ) : (
          <p style={{ textAlign: 'center', color: '#fff' }}>Tree will be displayed here</p>
        )}
      </div>
    </div>
  )
}

export default TreeVisualizer
