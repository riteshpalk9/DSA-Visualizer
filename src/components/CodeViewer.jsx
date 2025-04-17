import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeViewer = ({ selectedAlgorithm, highlightedLine }) => {
  let codeString = '';

  switch (selectedAlgorithm) {
    case 'bubbleSort':
      codeString = `function bubbleSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        // Swap elements
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
}`;
      break;
    case 'insertionSort':
      codeString = `function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      // Shift element to the right
      array[j + 1] = array[j];
      j--;
    }
    // Insert the key at the correct position
    array[j + 1] = key;
  }
}`;
      break;
    case 'selectionSort':
      codeString = `function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    // Swap the minimum element with the first element
    let temp = array[i];
    array[i] = array[minIndex];
    array[minIndex] = temp;
  }
}`;
      break;
    case 'mergeSort':
      codeString = `function mergeSort(array) {
  if (array.length < 2) return array;
  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid));
  const right = mergeSort(array.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  while (left.length && right.length) {
    // Compare elements and merge them in order
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result.concat(left, right);
}`;
      break;
    case 'quickSort':
      codeString = `function quickSort(array) {
  if (array.length < 2) return array;
  const pivot = array[array.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < array.length - 1; i++) {
    // Partition the array into elements less than pivot and greater than pivot
    if (array[i] < pivot) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`;
      break;
    default:
      codeString = '';
  }

  return (
    <SyntaxHighlighter
      language="javascript"
      style={docco}
      showLineNumbers
      wrapLines
      lineProps={lineNumber => {
        const style = { display: 'block' };
        if (lineNumber === highlightedLine) {
          style.backgroundColor = 'yellow';
        }
        return { style };
      }}
    >
      {codeString}
    </SyntaxHighlighter>
  );
};

export default CodeViewer;
