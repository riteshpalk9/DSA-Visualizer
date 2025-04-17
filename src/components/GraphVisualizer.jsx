import React, { useState, useEffect, useRef } from 'react'

const extraSmallGraph = { 0: [1], 1: [0, 2], 2: [1] }
const smallGraph = { 0: [1, 2], 1: [0, 3, 4], 2: [0, 4], 3: [1], 4: [1, 2, 5], 5: [4] }
const mediumGraph = { 0: [1, 2, 3], 1: [0, 4], 2: [0, 5], 3: [0, 6], 4: [1, 7], 5: [2, 8], 6: [3, 9], 7: [4, 10], 8: [5, 11], 9: [6, 12], 10: [7], 11: [8], 12: [9] }
const largeGraph = { 0: [1, 2, 3, 4], 1: [0, 5, 6], 2: [0, 7, 8], 3: [0, 9, 10], 4: [0, 11, 12], 5: [1, 13], 6: [1, 14], 7: [2, 15], 8: [2, 16], 9: [3, 17], 10: [3, 18], 11: [4, 19], 12: [4, 20], 13: [5], 14: [6], 15: [7], 16: [8], 17: [9], 18: [10], 19: [11], 20: [12] }

const GraphVisualizer = () => {
  const [graphData, setGraphData] = useState(extraSmallGraph)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs')
  const [graphSize, setGraphSize] = useState('extra-small')
  const [traversalOutput, setTraversalOutput] = useState('')
  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    createGraph()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData])

  const createGraph = () => {
    const totalNodes = Object.keys(graphData).length
    const newNodes = []
    for (let i = 0; i < totalNodes; i++) {
      newNodes.push({
        id: i,
        left: Math.random() * 80,
        top: Math.random() * 80,
        visited: false
      })
    }
    setNodes(newNodes)

    const newEdges = []
    Object.keys(graphData).forEach(from => {
      graphData[from].forEach(to => {
        if (parseInt(from) < to) {
          newEdges.push({ from: parseInt(from), to })
        }
      })
    })
    setEdges(newEdges)
    setTraversalOutput('')
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const resetGraph = () => {
    setNodes(prev => prev.map(node => ({ ...node, visited: false })))
    setTraversalOutput('')
  }

  const bfs = async start => {
    let queue = [start]
    let visited = new Set([start])
    let output = `BFS Traversal: ${start}`
    setTraversalOutput(output)

    while (queue.length > 0) {
      const current = queue.shift()
      setNodes(prev =>
        prev.map(node =>
          node.id === current ? { ...node, visited: true } : node
        )
      )
      await sleep(500)
      graphData[current].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
          output += `, ${neighbor}`
          setTraversalOutput(output)
        }
      })
    }
  }

  const dfs = async (current, visited = new Set(), outputObj = { current: `DFS Traversal: ${current}` }) => {
    visited.add(current)
    setNodes(prev =>
      prev.map(node =>
        node.id === current ? { ...node, visited: true } : node
      )
    )
    setTraversalOutput(outputObj.current)
    await sleep(500)
    for (const neighbor of graphData[current]) {
      if (!visited.has(neighbor)) {
        outputObj.current += `, ${neighbor}`
        setTraversalOutput(outputObj.current)
        await dfs(neighbor, visited, outputObj)
      }
    }
  }

  const startTraversal = () => {
    resetGraph()
    if (selectedAlgorithm === 'bfs') {
      bfs(0)
    } else {
      dfs(0, new Set(), { current: 'DFS Traversal: 0' })
    }
  }

  const handleAlgorithmChange = e => setSelectedAlgorithm(e.target.value)
  const handleGraphSizeChange = e => {
    const size = e.target.value
    setGraphSize(size)
    if (size === 'extra-small') setGraphData(extraSmallGraph)
    else if (size === 'small') setGraphData(smallGraph)
    else if (size === 'medium') setGraphData(mediumGraph)
    else if (size === 'large') setGraphData(largeGraph)
  }

  const getEdgeStyle = edge => {
    const nodeA = nodes.find(node => node.id === edge.from)
    const nodeB = nodes.find(node => node.id === edge.to)
    if (!nodeA || !nodeB) return {}
    const x1 = (nodeA.left / 100) * containerSize.width + 20
    const y1 = (nodeA.top / 100) * containerSize.height + 20
    const x2 = (nodeB.left / 100) * containerSize.width + 20
    const y2 = (nodeB.top / 100) * containerSize.height + 20
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
    return {
      width: `${length}px`,
      transform: `translate(${x1}px, ${y1}px) rotate(${angle}deg)`
    }
  }

  return (
    <div className="page-container">
      <h1>Graph Traversal Visualizer</h1>
      <div className="controls">
        <label>
          Algorithm:
          <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>
        </label>
        <label>
          Graph Size:
          <select value={graphSize} onChange={handleGraphSizeChange}>
            <option value="extra-small">Extra Small</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
        <button onClick={startTraversal}>Start Traversal</button>
        <button onClick={resetGraph}>Reset</button>
      </div>
      <div
        id="graph-container"
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          backgroundColor: '#333',
          borderRadius: '10px',
          marginTop: '20px'
        }}
      >
        {nodes.map(node => (
          <div
            key={node.id}
            className={`node ${node.visited ? 'visited' : ''}`}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              backgroundColor: node.visited ? '#ff4d4d' : '#61dafb',
              color: '#fff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              left: `${node.left}%`,
              top: `${node.top}%`
            }}
          >
            {node.id}
          </div>
        ))}
        {edges.map((edge, index) => (
          <div
            key={index}
            className="edge"
            style={{
              position: 'absolute',
              backgroundColor: '#61dafb',
              height: '2px',
              transformOrigin: '0 0',
              ...getEdgeStyle(edge)
            }}
          ></div>
        ))}
      </div>
      <p style={{ marginTop: '10px' }}>{traversalOutput}</p>
    </div>
  )
}

export default GraphVisualizer
