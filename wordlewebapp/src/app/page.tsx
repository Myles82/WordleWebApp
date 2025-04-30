'use client';
import { useState, useEffect } from 'react';
import ToggleSwitch from '../components/ToggleSwitch';


export default function Home() {
  const [word, setWord] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winMessage, setWinMessage] = useState('');
  const [loseMessage, setLoseMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);


  // Shows message before fading out
  const showTemporaryMessage = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
  
    setTimeout(() => {
      setShowError(false);
    }, 1000); // Start fade-out
  
    setTimeout(() => {
      setErrorMessage('');
    }, 1500); // Fully hide after fade
  };
  
  // Fetches new word from api on refresh
  useEffect(() => {
    const fetchWord = async () => {
      const res = await fetch('/api/get-word');
      const data = await res.json();
      setWord(data.word);
    };

    fetchWord();
  }, []);
  
  // Virtual keyboard row symbols
  const keyboardRows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    ['ENTER', ...'ZXCVBNM'.split(''), '⌫'],
  ];
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({});

  // Gets full color string for blocks based on simple color string
  const getKeyColor = (letter: string) => {
    const color = usedKeys[letter];
    switch (color) {
      case 'green':
        return 'bg-green-500 border-green-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 border-yellow-500 text-black';
      case 'gray':
        return 'bg-[#4d4d4d] border-[#4d4d4d] text-white';
      default:
        return 'bg-[#909090] border-[#4d4d4d] text-white';
    }
  };
  
  // Shows virtual keyboard and updates colors
  const renderKeyboard = () => (
    <div className="mt-8 space-y-2">
      {keyboardRows.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center space-x-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyInput(key)}
              className={` px-3 py-2 rounded text-sm border font-semibold ${getKeyColor(
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
  
  

  const [rows, setRows] = useState<string[][]>(
    Array(NUM_ROWS).fill(null).map(() => [])
  );
  const [colors, setColors] = useState<string[][]>(
    Array(NUM_ROWS).fill(null).map(() => Array(WORD_LENGTH).fill(''))
  );
  const [currentRow, setCurrentRow] = useState(0);

  // Directs keyboard input to handleKeyDown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyInput(e.key);
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRow]);

  // Call backend to check if word matches and is in dictionary
  const checkGuess = async (guess: string[]) => {
    const res = await fetch('/api/check-word', {
      method: 'POST',
      body: JSON.stringify({ guess }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await res.json();

    // show message if word is not valid
    if (data.error) {
      showTemporaryMessage("Word not in Dictionary");
      return;
    }
  
    const resultColors = data.result;
    
    // Sets colors of blocks for matches
    setColors((prev) => {
      const updated = [...prev];
      updated[currentRow] = resultColors;
      return updated;
    });
    
    // Sets colors of virtual keyboard for used and matching letters
    setUsedKeys((prev) => {
      const updated = { ...prev };
      guess.forEach((letter, i) => {
        const current = updated[letter];
        const next = resultColors[i];
  
        if (current === 'green') return;
        if (current === 'yellow' && next !== 'green') return;
  
        updated[letter] = next;
      });
      return updated;
    });
  
    // Check for win
    if (Array.isArray(resultColors) && resultColors.every((color) => color === 'green')) {
      setWinMessage('🎉 You Win!');
      setGameOver(true);
      return;
    }
  
    // Go to next row if not last and not game over
    if (currentRow < NUM_ROWS - 1) {
      setCurrentRow(currentRow + 1);
    } else {
      setGameOver(true);
      setLoseMessage(`Game Over. The word was ${word}`);
    }
  };
  
  
  // Enables typing on virtual keyboard
  const handleKeyInput = (key: string) => {
    if (gameOver) return;
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
  
  // Gets full color string for virtual keyboard based on simple color string
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500 border-green-500';
      case 'yellow':
        return 'bg-yellow-500 border-yellow-500';
      case 'gray':
        return 'bg-[#4d4d4d] border-[#4d4d4d] border-opacity-50';
      default:
        return 'border-[#4d4d4d] border-opacity-50';
    }
  };

  // Shows letter boxes
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
  // screen elements
  return (
    <div className="h-screen w-screen bg-black flex flex-col justify-center items-center space-y-1">
      
      <div className="flex flex-row">
      {/* Show word toggle */}
      <div className="absolute top-4 left-4">
        <ToggleSwitch isOn={isVisible} setIsOn={setIsVisible} />
      </div>

      {/* Info Button and Bubble */}
<div className="absolute top-4 right-4 z-50">
  <button
    onClick={() => setShowInfo(!showInfo)}
    className="w-8 h-8 rounded-full bg-white text-black font-bold text-lg flex items-center justify-center shadow-md hover:bg-gray-200 transition"
    title="Info"
  >
    i
  </button>

  {showInfo && (
    <div className="absolute top-10 right-0 bg-white text-black text-sm p-4 rounded-lg shadow-xl w-64 z-50">
      <p>
        Welcome to <strong>Mordle</strong>!<br />
        wordle with an M<br /><br />
        Guess the word in 6 tries.<br />
        Each guess must be a valid word.<br />
        Letters change color to show how close you are.<br /><br />
        Green - Letter in word and in correct spot<br /><br />
        Yellow - Letter in word but not in correct spot<br /><br />
        Grey - Letter not in the word<br /><br />
        Refresh the page for a new word
      </p>
      <button
        className="mt-2 text-xs text-blue-500 hover:underline"
        onClick={() => setShowInfo(false)}
      >
        Close
      </button>
    </div>
  )}
</div>

      </div>


      {/* Not in dictionary Message */}
      {errorMessage && (
        <div
          className={`text-white bg-[#4d4d4d] px-4 py-2 rounded-md mb-10 -mt-20 transition-opacity duration-500 ${
            showError ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {errorMessage}
        </div>
      )}

      {/* Win message */}
      {winMessage && (
        <div className="text-white bg-green-600 text-2xl mb-4 -mt-16 animate-bounce px-4 py-2 rounded-md  ${
                  ">
          {winMessage}
        </div>
      )}

      {/* Lose message */}
      {loseMessage && (
        <div className="text-white bg-red-600 text-2xl mb-4 -mt-16 px-4 py-2 rounded-md  ${
                  ">
          {loseMessage}
        </div>
      )}

      {/* Title */}
      <h1 className="text-white font-bold font-[Inter] space-x-2 text-6xl">Mordle</h1>

      {/* Shown word when toggle on */}
      {isVisible && (
        <h1 className="text-4xl mb-4 text-white">
          Your Word: {word || 'Loading...'}
        </h1>
      )}      <div className={isVisible?"mt-6":"mt-20"}>
      
      {/* Box grid */}
      <div className="flex flex-col w-screen space-x-2 space-y-1 justify-center items-center">
      {rows.map((row, index) => renderBoxes(row, colors[index], index))}

      {/* Virtual keyboard */}
      {renderKeyboard()}
      </div>
      </div>
     
    </div>
  );
}

