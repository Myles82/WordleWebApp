'use client';
import { useState, useEffect } from 'react';
import ToggleSwitch from '../components/ToggleSwitch';

export default function Home() {
  const [word, setWord] = useState('');

  useEffect(() => {
    const fetchWord = async () => {
      const res = await fetch('/api/get-word');
      const data = await res.json();
      if (data.error === 'Invalid word') {
  alert('That word isn’t in the dictionary!');
  return;
}
      setWord(data.word);
    };

    fetchWord();
  }, []);
  
  const keyboardRows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['ENTER', ...'ZXCVBNM'.split(''), '⌫'],
  ];
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({});

  const getKeyColor = (letter: string) => {
    const color = usedKeys[letter];
    switch (color) {
      case 'green':
        return 'bg-green-500 border-green-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 border-yellow-500 text-black';
      case 'gray':
        return 'bg-gray-700 border-gray-700 text-white';
      default:
        return ' border-gray-600 text-white';
    }
  };
  
  const renderKeyboard = () => (
    <div className="mt-8 space-y-2">
      {keyboardRows.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center space-x-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyInput(key)}
              className={`px-3 py-2 rounded text-sm border font-semibold ${getKeyColor(
                key
              )} hover:bg-opacity-80 transition`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
  

  
  const NUM_ROWS = 6;
  const WORD_LENGTH = 5;
  const targetWord = 'PLANT';
  

  const [rows, setRows] = useState<string[][]>(
    Array(NUM_ROWS).fill(null).map(() => [])
  );
  const [colors, setColors] = useState<string[][]>(
    Array(NUM_ROWS).fill(null).map(() => Array(WORD_LENGTH).fill(''))
  );
  const [currentRow, setCurrentRow] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyInput(e.key);
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRow]);

  const checkGuess = async (guess: string[]) => {
    const res = await fetch('/api/check-word', {
      method: 'POST',
      body: JSON.stringify({ guess }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await res.json();
  
    if (!res.ok || data.error) {
      alert(data.error || 'Something went wrong.');
      return;
    }
  
    const resultColors = data.result;
  
    setColors((prev) => {
      const updated = [...prev];
      updated[currentRow] = resultColors;
      return updated;
    });
  
    setUsedKeys((prev) => {
      const updated = { ...prev };
  
      guess.forEach((letter, i) => {
        const current = updated[letter];
        const next = resultColors[i];
  
        if (current === 'green') return;
        if (current === 'yellow' && next === 'gray') return;
        if (current === 'yellow' && next === 'yellow') return;
  
        updated[letter] = next;
      });
  
      return updated;
    });

    if (currentRow < NUM_ROWS - 1) {
      setCurrentRow(currentRow + 1);
    }
    
    
  };
  

  const handleKeyInput = (key: string) => {
    key = key.toUpperCase();
  
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const row = [...updatedRows[currentRow]];
  
      if (key === 'BACKSPACE' || key === '⌫') {
        row.pop();
      } else if (key === 'ENTER') {
        if (row.length === WORD_LENGTH) {
          checkGuess(row);
          
        }
      } else if (/^[A-Z]$/.test(key) && row.length < WORD_LENGTH) {
        row.push(key);
      }
  
      updatedRows[currentRow] = row;
      return updatedRows;
    });
  };
  

  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500 border-green-500';
      case 'yellow':
        return 'bg-yellow-500 border-yellow-500';
      case 'gray':
        return 'bg-gray-700 border-gray-700';
      default:
        return 'border-gray-500';
    }
  };

  const renderBoxes = (letters: string[], colorRow: string[], index: number) => {
    return (
      <div key={index} className="flex space-x-2 mb-2">
        {Array(WORD_LENGTH)
          .fill('')
          .map((_, i) => (
            <div
              key={i}
              className={`w-16 aspect-square text-white flex items-center justify-center rounded-md text-2xl border-2 ${getColorClass(
                colorRow[i]
              )}`}
            >
              {letters[i] || ''}
            </div>
          ))}
      </div>
    );
  };
  
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center space-y-1">
      <div className="absolute top-4 left-4">
        <ToggleSwitch isOn={isVisible} setIsOn={setIsVisible} />
      </div>
      <h1 className="text-white space-x-2 text-6xl">Wordle</h1>
      {isVisible && (
        <h1 className="text-4xl mb-4 text-white">
          Your Word: {word || 'Loading...'}
        </h1>
      )}      <div className={isVisible?"mt-6":"mt-20"}>
     
      <div className="flex flex-col w-screen space-x-2 space-y-1 justify-center items-center">
      {rows.map((row, index) => renderBoxes(row, colors[index], index))}
      {renderKeyboard()}
      </div>
      </div>
     
    </div>
  );
}

