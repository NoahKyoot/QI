import React, { useState, useEffect } from 'react';

const RadiologyGame = () => {
  const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState([]);

  const report = `FINDINGS: Lung bases demonstrate mild dependent change. The heart size is normal. Liver, gallbladder, spleen, pancreas, adrenal glands, aorta, IVC and right kidney are normal. There is moderate left-sided hydronephrosis with associated delayed nephrogram, hydroureter, and with a 0.1 cm stone in the distal left ureter at the UVJ as seen on image 108 series 4. There is mild periureteral stranding on the left side. There is left-sided nephrolithiasis and with a 0.3 cm stone lower pole of the left kidney. There is a simple cyst interpolar region left kidney increased in size compared with prior and measuring 1.8 cm. GI tract nonobstructed. Terminal ileum, cecum and appendix are normal. Bowel loops are not obstructed. Transverse and descending colonic wall thickening likely due to nondistention. Decompressed urinary bladder. There is a right-sided adnexal cyst measuring 2.5 cm. Left adnexal region is normal. There is no gross free fluid. Osseous structures normal for age.`;

  const [words, setWords] = useState(report.split(' ').map((word, index) => ({
    id: index,
    text: word,
    visible: true
  })));

  const targetFinding = "left-sided nephrolithiasis";

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            setGameState('lost');
            return 0;
          }
          return prev - 1;
        });

        // Randomly hide words
        setWords(prevWords => {
          const visibleWords = prevWords.filter(w => w.visible);
          if (visibleWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * visibleWords.length);
            return prevWords.map((word, idx) => {
              if (idx === randomIndex && !targetFinding.includes(word.text)) {
                return { ...word, visible: false };
              }
              return word;
            });
          }
          return prevWords;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  const handleWordClick = (word) => {
    if (gameState !== 'playing') return;
    
    if (targetFinding.includes(word.text)) {
      const timeBonus = Math.floor(timeLeft * 10);
      const newScore = score + timeBonus;
      setScore(newScore);
      setGameState('won');
      setHighScores(prev => [...prev, newScore].sort((a, b) => b - a).slice(0, 5));
    }
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(30);
    setWords(report.split(' ').map((word, index) => ({
      id: index,
      text: word,
      visible: true
    })));
    setScore(0);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: 0 }}>Radiology Finding Game</h1>
          <div>
            <span>Time: {timeLeft}s</span>
            <span style={{ marginLeft: '20px' }}>Score: {score}</span>
          </div>
        </div>

        {gameState === 'ready' && (
          <div style={{ textAlign: 'center' }}>
            <h2>Find the Important Finding!</h2>
            <p>You have 30 seconds to find: "{targetFinding}"</p>
            <button
              onClick={startGame}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div>
            <div style={{
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <p><strong>Find this finding:</strong> {targetFinding}</p>
            </div>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '4px',
              lineHeight: '1.6'
            }}>
              {words.map((word) => (
                <span
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  style={{
                    margin: '0 4px',
                    cursor: 'pointer',
                    opacity: word.visible ? 1 : 0,
                    transition: 'opacity 0.5s',
                    backgroundColor: targetFinding.includes(word.text) ? '#ffeb3b' : 'transparent'
                  }}
                >
                  {word.text}
                </span>
              ))}
            </div>
          </div>
        )}

        {(gameState === 'won' || gameState === 'lost') && (
          <div style={{ textAlign: 'center' }}>
            <h2>{gameState === 'won' ? 'Congratulations!' : 'Time\'s Up!'}</h2>
            <p>
              {gameState === 'won' 
                ? `You found the finding with ${timeLeft} seconds left! Score: ${score}`
                : 'Better luck next time!'}
            </p>
            <div style={{ marginTop: '20px' }}>
              <h3>High Scores</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {highScores.map((hs, index) => (
                  <li key={index} style={{
                    padding: '5px',
                    backgroundColor: index === 0 ? '#ffd700' : '#f8f9fa',
                    margin: '5px 0'
                  }}>
                    #{index + 1}: {hs}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={startGame}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadiologyGame;
