// 📥 Import both game modes
import { startAdventure } from './adventure.js';
import { startLevelMode } from './levelmode.js';

// 🏁 Main function to show the splash screen
export function showSplashScreen() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Clear game screen

  // 🎮 Game title
  const title = document.createElement('h1');
  title.textContent = 'Falling Words';
  title.style.textAlign = 'center';
  title.style.marginTop = '60px';
  title.style.color = 'white';

  // ▶️ Adventure mode button
  const adventureBtn = document.createElement('button');
  adventureBtn.textContent = 'Adventure Mode';
  adventureBtn.onclick = startAdventure;

  // 🎯 Level select button
  const levelBtn = document.createElement('button');
  levelBtn.textContent = 'Level Select';
  levelBtn.onclick = showLevelSelect;

  // 💅 Shared button styling
  [adventureBtn, levelBtn].forEach(btn => {
    btn.style.display = 'block';
    btn.style.margin = '20px auto';
    btn.style.padding = '12px 24px';
    btn.style.fontSize = '1.2rem';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '8px';
    btn.style.backgroundColor = '#333';
    btn.style.color = 'white';
    btn.style.border = '1px solid #666';
  });

  // 🧱 Add everything to the container
  container.append(title, adventureBtn, levelBtn);
}

// 🧩 Show Level Select Screen with 30 levels
function showLevelSelect() {
  const container = document.getElementById('game-container');
  container.innerHTML = ''; // Clear screen

  // 🏷️ Section title
  const title = document.createElement('h2');
  title.textContent = 'Choose a Level';
  title.style.textAlign = 'center';
  title.style.margin = '20px';
  title.style.color = 'white';
  container.appendChild(title);

  // 🧱 Wrapper for buttons
  const grid = document.createElement('div');
  grid.style.display = 'flex';
  grid.style.flexWrap = 'wrap';
  grid.style.justifyContent = 'center';
  grid.style.gap = '10px';
  grid.style.maxHeight = '70vh';
  grid.style.overflowY = 'auto';
  grid.style.padding = '10px 20px';

  // 🔢 Create 30 level buttons
  for (let i = 1; i <= 30; i++) {
    const btn = document.createElement('button');
    btn.textContent = `Level ${i}`;
    btn.onclick = () => startLevelMode(i);

    // 💅 Button style
    btn.style.padding = '10px 14px';
    btn.style.fontSize = '1rem';
    btn.style.borderRadius = '6px';
    btn.style.border = '1px solid #666';
    btn.style.backgroundColor = '#444';
    btn.style.color = 'white';
    btn.style.cursor = 'pointer';

    grid.appendChild(btn);
  }

  container.appendChild(grid);

  // 🔙 Back to splash
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  backBtn.onclick = showSplashScreen;
  backBtn.style.display = 'block';
  backBtn.style.margin = '20px auto';
  backBtn.style.padding = '10px 20px';
  backBtn.style.borderRadius = '6px';
  backBtn.style.backgroundColor = '#222';
  backBtn.style.color = 'white';
  backBtn.style.border = '1px solid #555';
  backBtn.style.cursor = 'pointer';
  container.appendChild(backBtn);
}
