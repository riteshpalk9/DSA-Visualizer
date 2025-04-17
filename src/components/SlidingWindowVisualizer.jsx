import React, { useState } from 'react'

const generateRandomArray = size => {
  const arr = []
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 100) + 1)
  }
  return arr
}

const SlidingWindowVisualizer = () => {
  const arraySize = 10
  const [array, setArray] = useState(generateRandomArray(arraySize))
  const [windowSize, setWindowSize] = useState(3)
  const [currentWindow, setCurrentWindow] = useState({ start: null, end: null })

  const createArrayElements = () =>
    array.map((value, idx) => (
      <div
        key={idx}
        className="array-element"
        style={{
          backgroundColor:
            currentWindow.start !== null && idx >= currentWindow.start && idx <= currentWindow.end
              ? '#f76c6c'
              : '#61dafb'
        }}
      >
        {value}
      </div>
    ))

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const visualizeSlidingWindow = async () => {
    if (windowSize > array.length) {
      alert('Window size cannot be greater than array size!')
      return
    }
    for (let i = 0; i <= array.length - windowSize; i++) {
      setCurrentWindow({ start: i, end: i + windowSize - 1 })
      await sleep(1000)
    }
    setCurrentWindow({ start: null, end: null })
  }

  const randomizeArray = () => {
    setArray(generateRandomArray(arraySize))
    setCurrentWindow({ start: null, end: null })
  }

  return (
    <div className="page-container">
      <h1>Sliding Window Visualizer</h1>
      <div className="visualization-box">
        <div className="window-container">
          <div id="array-container" style={{ display: 'flex', gap: '10px' }}>
            {createArrayElements()}
          </div>
          <div className="window">
            <div>Start: {currentWindow.start !== null ? currentWindow.start : '-'}</div>
            <div>End: {currentWindow.end !== null ? currentWindow.end : '-'}</div>
          </div>
        </div>
        <div className="controls" style={{ marginTop: '20px' }}>
          <label>
            Window Size:
            <input
              type="number"
              value={windowSize}
              min="1"
              onChange={e => setWindowSize(parseInt(e.target.value))}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
          <button onClick={visualizeSlidingWindow}>Start Visualization</button>
          <button onClick={randomizeArray}>Randomize Array</button>
        </div>
      </div>
    </div>
  )
}

export default SlidingWindowVisualizer
