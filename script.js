// 🧠 Entry Point for Falling Words (v2.0.0)
// This file only loads the splash screen, which then handles mode selection.

import { showSplashScreen } from './modes/splash.js';

// Wait until the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
  // 🏁 Show the title screen (Adventure / Level Select)
  showSplashScreen();
});
