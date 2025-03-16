import { useEffect, useState } from "react";
import confetti from "canvas-confetti";


const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [chances, setChances] = useState(0);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setChances(totalCards * 2);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
    }
    setTimeout(() => {
      setFlipped([]);
      setDisabled(false);
    }, 1000);
  };

  const handleClick = (id) => {
    if (disabled || won || flipped.includes(id) || chances === 0) return;
    if (showInstructions) setShowInstructions(false);
    
    setChances((prev) => prev - 1);

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      setFlipped([...flipped, id]);
      checkMatch(id);
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
      confetti({
        particleCount: 300,
        spread: 160,
        origin: { y: 0.6 },
      });
    }
  }, [solved, cards]);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4 relative">
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Instructions
      </button>

      {showInstructions && (
        <div className="absolute top-16 right-4 bg-white text-black shadow-lg p-6 w-80 rounded-lg transition-opacity duration-500 opacity-100">
          <h2 className="text-lg font-bold mb-2">How to Play</h2>
          <ul className="list-disc pl-4 text-sm">
            <li>Click on a card to reveal its number.</li>
            <li>Find matching pairs to solve them.</li>
            <li>Match all pairs to win!</li>
            <li>Use the grid size input to adjust difficulty.</li>
          </ul>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid Size: (max 10)
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="border-2 border-gray-300 rounded px-2 py-1"
        />
        <p className="text-lg mt-2 font-semibold text-center w-full">Max Chances: {chances}</p>
      </div>

      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300  ${
              isFlipped(card.id)
                ? isSolved(card.id)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-400"
            }`}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>

      {won ? (
        <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
          You Won!
        </div>
      ) : chances === 0 ? (
        <div className="mt-4 text-4xl font-bold text-red-600 animate-bounce">
          Game Over!
        </div>
      ) : null}

      <button
        onClick={initializeGame}
        className="mt-4 mb-8 px-4 py-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won || chances === 0 ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
