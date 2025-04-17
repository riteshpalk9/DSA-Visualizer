import React, { useState, useEffect, useRef } from 'react';
import CodeViewer from './CodeViewer'; // Ensure the path is correct

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(30);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');
  const [isPaused, setIsPaused] = useState(false);
  const [delayMs, setDelayMs] = useState(50);
  const [highlightedLine, setHighlightedLine] = useState(null);

  // Use a ref so our async functions always see the latest pause status.
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    randomizeArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateRandomArray = () => {
    const arr = [];
    for (let i = 0; i < arraySize; i++) {
      arr.push(Math.floor(Math.random() * 100) + 1);
    }
    return arr;
  };

  const randomizeArray = () => {
    setArray(generateRandomArray());
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Wait until the sorting is resumed
  const pauseIfNeeded = async () => {
    while (isPausedRef.current) {
      await sleep(100);
    }
  };

  const createBars = () =>
    array.map((value, idx) => (
      <div
        key={idx}
        className="bar"
        style={{
          height: `${value * 3}px`,
          flex: 1,
          margin: '0 1px',
          backgroundColor: '#61dafb',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          transition: 'height 0.3s, background-color 0.3s'
        }}
      >
        <div className="value-text">{value}</div>
      </div>
    ));

  // ====================
  // Sorting Algorithms
  // ====================

  // Bubble Sort with visualization highlight
  const bubbleSort = async () => {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          // Highlight the swap line (visualization)
          setHighlightedLine(5); // This line represents the swap operation in the displayed code
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
          setArray([...array]);

          // Visualization: highlight bars being swapped
          bars[j].style.backgroundColor = 'red';
          bars[j + 1].style.backgroundColor = 'red';

          await pauseIfNeeded();
          await sleep(delayMs);

          bars[j].style.backgroundColor = '#61dafb';
          bars[j + 1].style.backgroundColor = '#61dafb';

          // Remove code highlight after swap
          setHighlightedLine(null);
        }
      }
    }
  };

  // Insertion Sort with visualization highlight
  const insertionSort = async () => {
    const bars = document.getElementsByClassName('bar');
    for (let i = 1; i < array.length; i++) {
      let key = array[i];
      let j = i - 1;
      while (j >= 0 && array[j] > key) {
        // Highlight the shifting line (visualization)
        setHighlightedLine(7);
        array[j + 1] = array[j];
        setArray([...array]);

        // Visualization: highlight shifting bars
        bars[j].style.backgroundColor = 'red';
        bars[j + 1].style.backgroundColor = 'red';
        await pauseIfNeeded();
        await sleep(delayMs);
        bars[j].style.backgroundColor = '#61dafb';
        bars[j + 1].style.backgroundColor = '#61dafb';

        j--;
        setHighlightedLine(null);
      }
      // Highlight key insertion (visualization)
      setHighlightedLine(11);
      array[j + 1] = key;
      setArray([...array]);
      await pauseIfNeeded();
      await sleep(delayMs);
      setHighlightedLine(null);
    }
  };

  // Selection Sort with visualization highlight
  const selectionSort = async () => {
    const bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        // Highlight swap operation (visualization)
        setHighlightedLine(11);
        let temp = array[i];
        array[i] = array[minIndex];
        array[minIndex] = temp;
        setArray([...array]);
        bars[i].style.backgroundColor = 'red';
        bars[minIndex].style.backgroundColor = 'red';
        await pauseIfNeeded();
        await sleep(delayMs);
        bars[i].style.backgroundColor = '#61dafb';
        bars[minIndex].style.backgroundColor = '#61dafb';
        setHighlightedLine(null);
      }
    }
  };

  // Merge Sort with visualization highlight
  const mergeSort = async () => {
    async function mergeSortHelper(l, r) {
      if (l >= r) return;
      let mid = Math.floor((l + r) / 2);
      await mergeSortHelper(l, mid);
      await mergeSortHelper(mid + 1, r);
      await merge(l, mid, r);
    }
    async function merge(l, mid, r) {
      let left = array.slice(l, mid + 1);
      let right = array.slice(mid + 1, r + 1);
      let i = 0, j = 0, k = l;
      const bars = document.getElementsByClassName('bar');
      while (i < left.length && j < right.length) {
        // Highlight merging comparison (visualization)
        setHighlightedLine(5);
        if (left[i] <= right[j]) {
          array[k] = left[i];
          i++;
        } else {
          array[k] = right[j];
          j++;
        }
        setArray([...array]);
        bars[k].style.backgroundColor = 'red';
        await pauseIfNeeded();
        await sleep(delayMs);
        bars[k].style.backgroundColor = '#61dafb';
        k++;
        setHighlightedLine(null);
      }
      while (i < left.length) {
        array[k] = left[i];
        i++;
        k++;
        setArray([...array]);
        await pauseIfNeeded();
        await sleep(delayMs);
      }
      while (j < right.length) {
        array[k] = right[j];
        j++;
        k++;
        setArray([...array]);
        await pauseIfNeeded();
        await sleep(delayMs);
      }
    }
    await mergeSortHelper(0, array.length - 1);
  };

  // Quick Sort with visualization highlight
  const quickSort = async () => {
    async function quickSortHelper(low, high) {
      if (low < high) {
        let pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    }
    async function partition(low, high) {
      const bars = document.getElementsByClassName('bar');
      let pivot = array[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        // Highlight partition condition (visualization)
        setHighlightedLine(8);
        if (array[j] < pivot) {
          i++;
          let temp = array[i];
          array[i] = array[j];
          array[j] = temp;
          setArray([...array]);
          bars[i].style.backgroundColor = 'red';
          bars[j].style.backgroundColor = 'red';
          await pauseIfNeeded();
          await sleep(delayMs);
          bars[i].style.backgroundColor = '#61dafb';
          bars[j].style.backgroundColor = '#61dafb';
        }
        setHighlightedLine(null);
      }
      let temp = array[i + 1];
      array[i + 1] = array[high];
      array[high] = temp;
      setArray([...array]);
      bars[i + 1].style.backgroundColor = 'red';
      bars[high].style.backgroundColor = 'red';
      await pauseIfNeeded();
      await sleep(delayMs);
      bars[i + 1].style.backgroundColor = '#61dafb';
      bars[high].style.backgroundColor = '#61dafb';
      return i + 1;
    }
    await quickSortHelper(0, array.length - 1);
  };

  const startSort = () => {
    if (selectedAlgorithm === 'bubbleSort') {
      bubbleSort();
    } else if (selectedAlgorithm === 'insertionSort') {
      insertionSort();
    } else if (selectedAlgorithm === 'selectionSort') {
      selectionSort();
    } else if (selectedAlgorithm === 'mergeSort') {
      mergeSort();
    } else if (selectedAlgorithm === 'quickSort') {
      quickSort();
    }
  };

  const refreshSort = () => {
    setIsPaused(false);
    isPausedRef.current = false;
    randomizeArray();
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
    isPausedRef.current = !isPausedRef.current;
  };

  return (
    <div className="page-container">
      <h1>Sorting Visualizer</h1>
      
      {/* Top Controls */}
      <div
        className="controls top-controls"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}
      >
        <input
          type="number"
          value={arraySize}
          min="1"
          max="100"
          onChange={e => setArraySize(parseInt(e.target.value))}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <select
          value={selectedAlgorithm}
          onChange={e => setSelectedAlgorithm(e.target.value)}
        >
          <option value="bubbleSort">Bubble Sort</option>
          <option value="insertionSort">Insertion Sort</option>
          <option value="selectionSort">Selection Sort</option>
          <option value="mergeSort">Merge Sort</option>
          <option value="quickSort">Quick Sort</option>
        </select>
        <input
          type="number"
          value={delayMs}
          min="1"
          onChange={e => setDelayMs(parseInt(e.target.value))}
          style={{ padding: '10px', fontSize: '16px' }}
          placeholder="Delay in ms"
        />
        <button onClick={togglePause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      
      {/* Middle Controls */}
      <div
        className="controls middle-controls"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}
      >
        <button onClick={() => setArray(generateRandomArray())}>
          Change Array Size
        </button>
        <button onClick={startSort}>Start Sort</button>
        <button onClick={randomizeArray}>Randomize Array</button>
        <button onClick={refreshSort}>Refresh</button>
      </div>
      
      {/* Visualization Container */}
      <div
        id="array-container"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          width: '80%',
          height: '60%',
          background: '#333',
          padding: '10px',
          margin: '20px auto',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {createBars()}
      </div>
      
      <div
        id="selected-algorithm"
        style={{ textAlign: 'center', marginTop: '10px' }}
      >
        Selected Algorithm: {selectedAlgorithm}
      </div>
      
      {/* Code Viewer */}
      <div style={{ width: '80%', margin: '20px auto' }}>
        <h2>Algorithm Code</h2>
        <CodeViewer
          selectedAlgorithm={selectedAlgorithm}
          highlightedLine={highlightedLine}
        />
      </div>
    </div>
  );
};

export default SortingVisualizer;
