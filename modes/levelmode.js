import { showSplashScreen } from './splash.js'; // 🔙 Return to main menu

// 🎯 Start Level Mode with fixed difficulty
export function startLevelMode(levelNum) {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Clear any existing UI

  // ⌨️ Create the input box
  const input = document.createElement('input');
  input.id = 'player-input';
  input.type = 'text';
  input.placeholder = 'Type a word...';
  input.autocomplete = 'off';
  container.appendChild(input);

  // 📊 Create UI elements
  const scoreDisplay = document.createElement('div');
  const levelDisplay = document.createElement('div');

  scoreDisplay.id = 'score';
  levelDisplay.id = 'difficulty';

  [scoreDisplay, levelDisplay].forEach(el => {
    el.style.position = 'absolute';
    el.style.left = '10px';
    el.style.fontSize = '1.2rem';
    el.style.color = 'white';
    el.style.zIndex = '1000';
  });

  scoreDisplay.style.top = '10px';
  levelDisplay.style.top = '40px';

  container.append(scoreDisplay, levelDisplay);

  // 🎮 Game state
  let score = 0;
  const fixedLevel = levelNum;
  const fallDuration = 8000;
  let activeWords = [];
  let gameOver = false;
  let wordBank = [];

  // 🧱 Difficulty configs for levels 0–10
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

  // 🔁 Get fixed config — levels beyond 10 keep reducing delay
  const config = getConfig(fixedLevel);
  const delay = config.delay;

  // 📚 Load words from file
  fetch('words.txt')
    .then(res => res.text())
    .then(text => {
      wordBank = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
      updateUI();
      dropWord(); // Start the game
    });

  // 🔁 Update UI display
  function updateUI() {
    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${fixedLevel}`;
  }

  // ⚙️ Get difficulty config by level number
  function getConfig(level) {
    if (level <= 10) return difficultyLevels[level];
    const base = difficultyLevels[10];
    const newDelay = Math.max(1000, base.delay - (level - 10) * 100); // Minimum: 1000ms
    return { delay: newDelay, weights: base.weights };
  }

  // 🔡 Choose word length by weighted probability
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

  // 🆎 Pick a word of a given length from the list
  function getWord(length) {
    const options = wordBank.filter(w => w.length === length);
    return options.length ? options[Math.floor(Math.random() * options.length)] : "???";
  }

  // 💧 Drop a word on screen
  function dropWord() {
    if (gameOver) return;

    const length = getWordLength(config.weights);
    const word = getWord(length);

    const el = document.createElement('div');
    el.className = 'word';
    el.textContent = word;
    el.style.left = Math.random() * 90 + 'vw';
    el.style.animationDuration = `${fallDuration / 1000}s`;
    container.appendChild(el);

    activeWords.push({ text: word, element: el });

    // 🧨 Missed word triggers game over
    setTimeout(() => {
      if (container.contains(el)) {
        container.removeChild(el);
        endGame();
      }
    }, fallDuration);

    // ⏱️ Schedule next word
    setTimeout(dropWord, delay);
  }

  // ⌨️ Word typed correctly
  input.addEventListener('input', () => {
    if (gameOver) return;
    const typed = input.value.trim().toLowerCase();
    const i = activeWords.findIndex(w => w.text === typed);
    if (i !== -1) {
      container.removeChild(activeWords[i].element);
      activeWords.splice(i, 1);
      input.value = '';
      score++;
      updateUI();
    }
  });

  // ☠️ End game on failure
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
