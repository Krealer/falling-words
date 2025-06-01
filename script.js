// 🌍 Game Elements
const container = document.getElementById('game-container');
const input = document.getElementById('player-input');

// 📊 Game State
let wordBank = [];           // Stores real educational words
let activeWords = [];        // Currently falling words
let score = 0;               // Player score
let level = 0;               // Difficulty level (based on perfect squares)
let delay = 5000;            // Time between word spawns
const fallDuration = 8000;   // Constant fall time
let gameOver = false;        // Game state flag

// 🖼️ UI References
let scoreDisplay, difficultyDisplay;

// 🧠 Difficulty Settings (Levels 0–10)
const difficultyLevels = [
  { delay: 5000, weights: [1, 0, 0, 0] },       // Level 0
  { delay: 5000, weights: [1, 0, 0, 0] },       // Level 1
  { delay: 4000, weights: [1, 0, 0, 0] },       // Level 2
  { delay: 5000, weights: [0.5, 0.5, 0, 0] },   // Level 3
  { delay: 4000, weights: [0.5, 0.5, 0, 0] },   // Level 4
  { delay: 3000, weights: [0.5, 0.5, 0, 0] },   // Level 5
  { delay: 4000, weights: [1/3, 1/3, 1/3, 0] }, // Level 6
  { delay: 3000, weights: [1/3, 1/3, 1/3, 0] }, // Level 7
  { delay: 4000, weights: [0.25, 0.25, 0.25, 0.25] }, // Level 8
  { delay: 3000, weights: [0.25, 0.25, 0.25, 0.25] }, // Level 9
  { delay: 3000, weights: [0.1, 0.2, 0.3, 0.4] }      // Level 10
];

// 📚 Load word list from file
fetch('words.txt')
  .then(res => res.text())
  .then(text => {
    wordBank = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
    setupUI();       // Set up score and difficulty displays
    setupTheme();    // Apply saved theme
    dropWord();      // Start game
  });

// 🖥️ Set up score/difficulty UI
function setupUI() {
  // Score
  scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'score';
  scoreDisplay.textContent = `Score: 0`;
  Object.assign(scoreDisplay.style, {
    position: 'absolute',
    top: '10px',
    left: '10px',
    fontSize: '1.5rem',
    color: 'white',
    zIndex: '1000'
  });

  // Difficulty
  difficultyDisplay = document.createElement('div');
  difficultyDisplay.id = 'difficulty';
  difficultyDisplay.textContent = `Difficulty: 0`;
  Object.assign(difficultyDisplay.style, {
    position: 'absolute',
    top: '40px',
    left: '10px',
    fontSize: '1.2rem',
    color: 'white',
    zIndex: '1000'
  });

  container.appendChild(scoreDisplay);
  container.appendChild(difficultyDisplay);
}

// 🔁 Update score and level text
function updateUI() {
  scoreDisplay.textContent = `Score: ${score}`;
  difficultyDisplay.textContent = `Difficulty: ${level}`;
}

// 🧮 Level = floor(sqrt(score))
function calculateLevel(score) {
  return Math.floor(Math.sqrt(score));
}

// 🔄 Get level config (delay and weights)
function getConfigForLevel(level) {
  if (level <= 10) {
    return difficultyLevels[level];
  }
  const base = difficultyLevels[10];
  const newDelay = Math.max(1000, base.delay - (level - 10) * 100);
  return {
    delay: newDelay,
    weights: base.weights
  };
}

// 🎲 Choose word length based on weights
function getWordLengthFromWeights(weights) {
  const lengths = [3, 4, 5, 6];
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) return lengths[i];
  }
  return 3; // Fallback
}

// 📖 Get a word of a specific length
function getWordFromBank(length) {
  const options = wordBank.filter(w => w.length === length);
  return options.length ? options[Math.floor(Math.random() * options.length)] : "???";
}

// ⬇️ Drop a word onto the screen
function dropWord() {
  if (gameOver) return;

  const config = getConfigForLevel(level);
  delay = config.delay;
  const wordLength = getWordLengthFromWeights(config.weights);
  const word = getWordFromBank(wordLength);

  const el = document.createElement('div');
  el.className = 'word';
  el.textContent = word;
  el.style.left = Math.random() * 90 + 'vw';
  el.style.animationDuration = (fallDuration / 1000) + 's';
  container.appendChild(el);

  activeWords.push({ text: word, element: el });

  // If word reaches bottom: game over
  setTimeout(() => {
    if (container.contains(el)) {
      container.removeChild(el);
      endGame();
    }
  }, fallDuration);

  setTimeout(dropWord, delay); // Schedule next word
}

// ⌨️ Listen for typed input
input.addEventListener('input', () => {
  if (gameOver) return;

  const typed = input.value.trim().toLowerCase();
  const matchIndex = activeWords.findIndex(w => w.text === typed);

  if (matchIndex !== -1) {
    const matched = activeWords[matchIndex];
    container.removeChild(matched.element);
    activeWords.splice(matchIndex, 1);
    input.value = '';
    score++;
    level = calculateLevel(score);
    updateUI();
  }
});

// ❌ End game and show retry
function endGame() {
  gameOver = true;

  const msg = document.createElement('div');
  msg.textContent = 'Game Over!';
  Object.assign(msg.style, {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '3rem',
    color: 'red',
    background: 'rgba(0,0,0,0.7)',
    padding: '20px 40px',
    borderRadius: '12px',
    zIndex: '1000'
  });

  const button = document.createElement('button');
  button.textContent = 'Retry';
  Object.assign(button.style, {
    position: 'absolute',
    top: '55%',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 20px',
    fontSize: '1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    zIndex: '1001'
  });

  input.disabled = true;
  button.addEventListener('click', () => location.reload());

  container.appendChild(msg);
  container.appendChild(button);
}

// 🌓 Theme toggle and persistence
function setupTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light');
      const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
    });
  }
}
