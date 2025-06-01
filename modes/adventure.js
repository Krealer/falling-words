import { showSplashScreen } from './splash.js'; // 🔙 For returning to the title screen

// 🌄 Adventure Mode: Dynamic difficulty increases based on player's score
export function startAdventure() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Clear previous content

  // ⌨️ Create input box
  const input = document.createElement('input');
  input.id = 'player-input';
  input.type = 'text';
  input.placeholder = 'Type a word...';
  input.autocomplete = 'off';
  container.appendChild(input);

  // 🧾 Create UI for score, difficulty, high score
  const scoreDisplay = document.createElement('div');
  const difficultyDisplay = document.createElement('div');
  const highScoreDisplay = document.createElement('div');

  scoreDisplay.id = 'score';
  difficultyDisplay.id = 'difficulty';
  highScoreDisplay.id = 'high-score';

  // 📐 Positioning and styling
  [scoreDisplay, difficultyDisplay, highScoreDisplay].forEach(el => {
    el.style.position = 'absolute';
    el.style.left = '10px';
    el.style.fontSize = '1.2rem';
    el.style.color = 'white';
    el.style.zIndex = '1000';
  });

  scoreDisplay.style.top = '10px';
  difficultyDisplay.style.top = '40px';
  highScoreDisplay.style.top = '70px';

  container.append(scoreDisplay, difficultyDisplay, highScoreDisplay);

  // 🔧 Game State
  let score = 0;
  let level = 0;
  let delay = 5000;
  const fallDuration = 8000;
  let activeWords = [];
  let gameOver = false;
  let wordBank = [];

  // 🎚️ Difficulty settings for levels 0–10
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

  // 📚 Load educational words from words.txt
  fetch('words.txt')
    .then(res => res.text())
    .then(text => {
      wordBank = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
      updateUI();
      dropWord(); // Start the game loop
    });

  // 🔁 Update score, difficulty, and high score
  function updateUI() {
    scoreDisplay.textContent = `Score: ${score}`;
    difficultyDisplay.textContent = `Difficulty: ${level}`;
    highScoreDisplay.textContent = `High Score: ${localStorage.getItem('highScore') || 0}`;
  }

  // 🧠 Score to level conversion using perfect squares
  function calculateLevel(score) {
    return Math.floor(Math.sqrt(score));
  }

  // 📊 Get difficulty config for a given level
  function getConfigForLevel(level) {
    if (level <= 10) {
      return difficultyLevels[level];
    }
    const base = difficultyLevels[10];
    const newDelay = Math.max(1000, base.delay - (level - 10) * 100); // Hidden levels
    return { delay: newDelay, weights: base.weights };
  }

  // 🔡 Get a word length based on weight probabilities
  function getWordLength(weights) {
    const lengths = [3, 4, 5, 6];
    const rand = Math.random();
    let acc = 0;
    for (let i = 0; i < weights.length; i++) {
      acc += weights[i];
      if (rand < acc) return lengths[i];
    }
    return 3;
  }

  // 🆎 Get a word of a given length from the word bank
  function getWord(length) {
    const options = wordBank.filter(w => w.length === length);
    return options.length ? options[Math.floor(Math.random() * options.length)] : "???";
  }

  // 💧 Spawn and animate a new falling word
  function dropWord() {
    if (gameOver) return;

    const config = getConfigForLevel(level);
    delay = config.delay;

    const length = getWordLength(config.weights);
    const word = getWord(length);

    const el = document.createElement('div');
    el.className = 'word';
    el.textContent = word;
    el.style.left = Math.random() * 90 + 'vw';
    el.style.animationDuration = `${fallDuration / 1000}s`;
    container.appendChild(el);

    activeWords.push({ text: word, element: el });

    // Check if word falls to the bottom
    setTimeout(() => {
      if (container.contains(el)) {
        container.removeChild(el);
        endGame();
      }
    }, fallDuration);

    // Schedule next word drop
    setTimeout(dropWord, delay);
  }

  // 🎯 Typing input check
  input.addEventListener('input', () => {
    if (gameOver) return;
    const typed = input.value.trim().toLowerCase();
    const i = activeWords.findIndex(w => w.text === typed);
    if (i !== -1) {
      container.removeChild(activeWords[i].element);
      activeWords.splice(i, 1);
      input.value = '';
      score++;
      level = calculateLevel(score);
      updateUI();

      // 🏆 Update high score
      const high = parseInt(localStorage.getItem('highScore') || 0);
      if (score > high) {
        localStorage.setItem('highScore', score);
      }
    }
  });

  // 💀 End the game when a word hits the bottom
  function endGame() {
    gameOver = true;
    input.disabled = true;

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

    const retry = document.createElement('button');
    retry.textContent = '← Back to Menu';
    Object.assign(retry.style, {
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

    retry.onclick = showSplashScreen;

    container.append(msg, retry);
  }
}
