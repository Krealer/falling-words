# 🧠 Falling Words Game

Type fast, think faster — educational words fall from the sky, and your goal is to type them before they hit the ground!

---

## 🎮 Play Now

👉 [Play on GitHub Pages](https://krealer.github.io/falling-words/)  
_(Replace with your actual GitHub Pages link)_

---

## 🚀 Game Modes

### 🗺️ Adventure Mode
- Dynamic difficulty based on your score
- Higher score = faster drops and longer words
- Survive as long as you can!

### 🎯 Level Select
- Play fixed levels 1–30
- Challenge yourself with increasing difficulty
- Great for focused practice

---

## 🧩 Features

- 📚 Real educational words (from `words.txt`)
- 🌗 Dark & light mode toggle
- 💾 High score tracking (localStorage)
- ⚡ Scalable to unlimited difficulty levels
- 🖥️ Responsive design (mobile/tablet/desktop)

---

## 🔧 Project Structure

```bash
falling-words/
├── index.html         # Game UI and HTML layout
├── style.css          # Styling (dark/light mode, responsive)
├── script.js          # Entry point — loads splash screen
├── words.txt          # Word list (edit this for new vocab)
└── modes/
    ├── splash.js      # Title screen & mode selector
    ├── adventure.js   # Main game mode (dynamic scaling)
    └── levelmode.js   # Fixed-level mode (1–30+)
