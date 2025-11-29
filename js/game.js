// ==================== GAME CONFIGURATION ====================
const sounds = {
  gameTheme: document.getElementById("game_theme"),
  gameOverSound: document.getElementById("game_over"),
  gameWinSound: document.getElementById("game_win"),
  bomb: document.getElementById("bomb"),
  shotBomb: document.getElementById("shotBomb"),
  addScore: document.getElementById("add_score"),
  golden: document.getElementById("golden"),
};

// Level System Configuration
const levelConfig = {
  currentLevel: 1,
  levelStartTime: 0,
  levelScore: 0,
  bossLevels: [5, 10, 15, 20, 25, 30],
  getLevelRequirement: function(level) {
    const isBoss = this.bossLevels.includes(level);
    const baseScore = 20 + (level * 15);
    const baseTime = 30 + (level * 5);
    return {
      score: isBoss ? Math.floor(baseScore * 1.5) : baseScore,
      time: isBoss ? Math.floor(baseTime * 1.5) : baseTime
    };
  },
  isBossLevel: function(level) {
    return this.bossLevels.includes(level);
  }
};

// Power-Up Types
const POWERUPS = {
  MULTI_SHOT: 'multiShot',
  RAPID_FIRE: 'rapidFire',
  SLOW_MOTION: 'slowMotion',
  SCORE_MULTIPLIER: 'scoreMultiplier',
  SHIELD: 'shield',
  MAGNET: 'magnet',
  EXTRA_LIFE: 'extraLife'
};

// Achievement Definitions
const ACHIEVEMENTS = {
  FIRST_BANANA: { id: 'firstBanana', name: 'First Banana', desc: 'Hit your first banana' },
  COMBO_MASTER: { id: 'comboMaster', name: 'Combo Master', desc: 'Reach 20x combo' },
  BOMB_EXPERT: { id: 'bombExpert', name: 'Bomb Expert', desc: 'Destroy 50 bombs' },
  LEVEL_10: { id: 'level10', name: 'Level 10', desc: 'Complete level 10' },
  PERFECT_LEVEL: { id: 'perfectLevel', name: 'Perfect Level', desc: 'Complete level without losing a life' },
  SPEED_DEMON: { id: 'speedDemon', name: 'Speed Demon', desc: 'Complete level in under 30 seconds' },
  SCORE_100: { id: 'score100', name: 'Centurion', desc: 'Reach 100 points' },
  SCORE_500: { id: 'score500', name: 'Half Grand', desc: 'Reach 500 points' },
  SCORE_1000: { id: 'score1000', name: 'Grand Master', desc: 'Reach 1000 points' },
  SCORE_5000: { id: 'score5000', name: 'Legend', desc: 'Reach 5000 points' },
  // New achievements
  BANANA_COLLECTOR: { id: 'bananaCollector', name: 'Banana Collector', desc: 'Collect 100 bananas' },
  GOLDEN_HUNTER: { id: 'goldenHunter', name: 'Golden Hunter', desc: 'Collect 50 golden fruits' },
  PERFECT_SHOT: { id: 'perfectShot', name: 'Perfect Shot', desc: 'Achieve 80% accuracy' },
  STREAK_MASTER: { id: 'streakMaster', name: 'Streak Master', desc: 'Complete 5 levels in a row' },
  TIME_TRIAL: { id: 'timeTrial', name: 'Time Trial', desc: 'Complete level in under 20 seconds' },
  SURVIVOR: { id: 'survivor', name: 'Survivor', desc: 'Complete 20 levels total' },
  POWER_UP_COLLECTOR: { id: 'powerupCollector', name: 'Power-Up Collector', desc: 'Collect 30 power-ups' },
  COMBO_KING: { id: 'comboKing', name: 'Combo King', desc: 'Reach 50x combo' },
  BOSS_SLAYER: { id: 'bossSlayer', name: 'Boss Slayer', desc: 'Complete 5 boss levels' },
  MARATHON: { id: 'marathon', name: 'Marathon', desc: 'Play for 1 hour total' }
};

const user = {
  name: "",
  score: 0,
  difficulty: "",
  currentLevel: 1,
  highestLevel: 1,
  totalScore: 0,
  lives: 3
};

const difficultySettings = {
  easy: {
    fruitSpeed: 7000,
    spawnInterval: 7000,
  },
  normal: {
    fruitSpeed: 5000,
    spawnInterval: 5000,
  },
  hard: {
    fruitSpeed: 3000,
    spawnInterval: 3000,
  },
};

const sources = ["banana.png", "bomb.gif", "golden.png"];
const FRUIT_TYPES = {
  BANANA: "banana.png",
  BOMB: "bomb.gif",
  GOLDEN: "golden.png",
  POISON: "poison.png", // Will use bomb.gif with different handling
  BONUS: "bonus.png" // Will use golden.png with different handling
};

// DOM Elements
let gameContainer;
const stopWatch = document.getElementById("stopwatch");
const scoreObject = document.getElementById("score");
const shootIndicator = document.getElementById("shootIndicator");
const userNameObject = document.getElementById("username");
const levelDisplay = document.getElementById("level-number");
const livesDisplay = document.getElementById("lives-display");
const comboDisplay = document.getElementById("combo-count");
const comboMultiplier = document.getElementById("combo-multiplier");
const levelProgressBar = document.getElementById("level-progress-fill");
const powerupIndicators = document.getElementById("powerup-indicators");
const pauseOverlay = document.getElementById("pause-overlay");
const pauseBtn = document.getElementById("pause-btn");
const timeRequirement = document.getElementById("time-requirement");

// Game State
let canShoot = true;
let imagesArray = [];
let gameInterval, stopWatchInterval;
let seconds = 0;
let minutes = 0;
let score = 0;
let levelScore = 0;
let lives = 3;
let combo = 0;
let comboMultiplierValue = 1;
let comboDecayTimer = null;
let lastComboTime = 0;
const COMBO_DECAY_TIME = 3000; // 3 seconds to lose combo
let isPaused = false;
let isGameActive = false;
let activePowerups = {};
let fruitIntervals = [];
let bombCount = 0;
let achievements = [];
let leaderboard = [];
let settings = {};

// Statistics tracking
let statistics = {
  totalBananas: 0,
  totalGolden: 0,
  totalBombs: 0,
  totalShots: 0,
  totalHits: 0,
  bestCombo: 0,
  totalPlayTime: 0,
  levelsCompleted: 0,
  perfectLevels: 0,
  gamesPlayed: 0,
  totalScore: 0
};

// Daily Challenges System
let dailyChallenges = {
  lastResetDate: null,
  currentChallenges: [],
  completedToday: []
};

// Progression System
let playerProgression = {
  xp: 0,
  level: 1,
  totalXP: 0,
  unlockedSkins: []
};

// Safe localStorage getter
function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

// Safe localStorage setter
function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing localStorage key "${key}":`, e);
  }
}

// Initialize from localStorage
achievements = getLocalStorage("achievements", []);
leaderboard = getLocalStorage("leaderboard", []);
statistics = getLocalStorage("statistics", statistics);
dailyChallenges = getLocalStorage("dailyChallenges", dailyChallenges);
playerProgression = getLocalStorage("playerProgression", playerProgression);

// Initialize daily challenges
function initializeDailyChallenges() {
  const today = new Date().toDateString();
  if (dailyChallenges.lastResetDate !== today) {
    dailyChallenges.lastResetDate = today;
    dailyChallenges.completedToday = [];
    dailyChallenges.currentChallenges = generateDailyChallenges();
    setLocalStorage("dailyChallenges", dailyChallenges);
  }
}

function generateDailyChallenges() {
  const challengeTypes = [
    { type: 'score', target: 200, reward: 50, desc: 'Score 200 points' },
    { type: 'combo', target: 15, reward: 30, desc: 'Reach 15x combo' },
    { type: 'bananas', target: 50, reward: 40, desc: 'Collect 50 bananas' },
    { type: 'levels', target: 3, reward: 60, desc: 'Complete 3 levels' },
    { type: 'perfect', target: 1, reward: 70, desc: 'Complete 1 perfect level' },
    { type: 'bombs', target: 10, reward: 35, desc: 'Destroy 10 bombs' }
  ];
  
  // Select 3 random challenges
  const selected = [];
  const available = [...challengeTypes];
  for (let i = 0; i < 3 && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available.splice(index, 1)[0]);
  }
  return selected;
}

function checkDailyChallenges() {
  dailyChallenges.currentChallenges.forEach((challenge, index) => {
    if (dailyChallenges.completedToday.includes(index)) return;
    
    let completed = false;
    switch(challenge.type) {
      case 'score':
        completed = score >= challenge.target;
        break;
      case 'combo':
        completed = combo >= challenge.target;
        break;
      case 'bananas':
        completed = statistics.totalBananas >= challenge.target;
        break;
      case 'levels':
        completed = statistics.levelsCompleted >= challenge.target;
        break;
      case 'perfect':
        completed = statistics.perfectLevels >= challenge.target;
        break;
      case 'bombs':
        completed = statistics.totalBombs >= challenge.target;
        break;
    }
    
    if (completed) {
      dailyChallenges.completedToday.push(index);
      awardChallengeReward(challenge);
      setLocalStorage("dailyChallenges", dailyChallenges);
    }
  });
}

function awardChallengeReward(challenge) {
  playerProgression.xp += challenge.reward;
  playerProgression.totalXP += challenge.reward;
  checkLevelUp();
  setLocalStorage("playerProgression", playerProgression);
  
  const mobile = isMobile();
  Swal.fire({
    title: 'Daily Challenge Complete! 🎉',
    text: challenge.desc,
    html: `<p>Reward: +${challenge.reward} XP</p>`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: mobile ? 'top' : 'top-end',
    width: mobile ? '90vw' : 'auto'
  });
}

function checkLevelUp() {
  const xpNeeded = playerProgression.level * 100;
  if (playerProgression.xp >= xpNeeded) {
    playerProgression.xp -= xpNeeded;
    playerProgression.level++;
    const mobile = isMobile();
    Swal.fire({
      title: 'Level Up! ⬆️',
      html: `<p>You reached Level ${playerProgression.level}!</p>`,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: mobile ? 'top' : 'top-end'
    });
    checkLevelUp(); // Check for multiple level ups
  }
}

// Initialize monkey
let monkey;

// ==================== INITIALIZATION ====================
// Tutorial System
let tutorialCompleted = getLocalStorage("tutorialCompleted", false);

function showTutorial() {
  if (tutorialCompleted) return;
  
  const mobile = isMobile();
  Swal.fire({
    title: "Welcome to Monkey Game! 🐵",
    html: `
      <div style="text-align: center; font-size: ${mobile ? '0.9rem' : '1rem'};">
        <p style="margin: ${mobile ? '8px 0' : '10px 0'}"><strong>Goal:</strong> Shoot bananas to score points!</p>
        <p style="margin: ${mobile ? '8px 0' : '10px 0'}"><strong>Controls:</strong></p>
        <p style="margin: ${mobile ? '5px 0' : '8px 0'}">${mobile ? 'Use buttons at bottom' : 'Arrow Keys to move, Space to shoot'}</p>
        <p style="margin: ${mobile ? '8px 0' : '10px 0'}"><strong>Tips:</strong></p>
        <ul style="text-align: left; margin: ${mobile ? '5px 0' : '10px 0'}; padding-left: ${mobile ? '20px' : '30px'};">
          <li>🍌 Bananas = 1 point</li>
          <li>⭐ Golden fruits = 2 points</li>
          <li>💣 Bombs explode nearby fruits</li>
          <li>🔥 Build combos for multipliers!</li>
          <li>💎 Collect power-ups for boosts</li>
        </ul>
        <label style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 15px;">
          <input type="checkbox" id="dontShowAgain" style="width: 20px; height: 20px;">
          Don't show again
        </label>
      </div>
    `,
    confirmButtonText: "Let's Play!",
    width: mobile ? "95vw" : "85vw",
    color: "orangered",
    background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    buttonsStyling: false,
    customClass: {
      confirmButton: "playAgain",
      title: "swal-title",
    },
    preConfirm: () => {
      if (document.getElementById("dontShowAgain")?.checked) {
        tutorialCompleted = true;
        setLocalStorage("tutorialCompleted", true);
      }
    }
  });
}

function initializeGame() {
  // Get game container
  gameContainer = document.getElementById("gameContainer") || document.querySelector("div.gameContainer") || document.querySelector("div[class=gameContainer]");
  
  if (!gameContainer) {
    console.error("Game container not found!");
    return;
  }
  
  // Load settings FIRST before applying them
  settings = getLocalStorage("settings", {
    soundVolume: 1,
    musicVolume: 1,
    musicEnabled: true,
    controlSensitivity: 1
  });
  
  // Retrieve user data
  try {
    const savedUser = getLocalStorage("user", {});
    user.name = savedUser.name || "UNKNOWN";
    user.score = savedUser.score || 0;
    user.difficulty = savedUser.difficulty || "normal";
    user.currentLevel = savedUser.currentLevel || 1;
    user.highestLevel = savedUser.highestLevel || 1;
    user.totalScore = savedUser.totalScore || 0;
  } catch (e) {
    console.error("Error loading user data:", e);
    user.name = "UNKNOWN";
    user.score = 0;
    user.difficulty = "normal";
    user.currentLevel = 1;
    user.highestLevel = 1;
    user.totalScore = 0;
  }
  
  levelConfig.currentLevel = user.currentLevel;
  const difficulty = user.difficulty;
  
  // Display username
  if (userNameObject) userNameObject.innerHTML = ` ${user.name}`;
  if (levelDisplay) levelDisplay.textContent = levelConfig.currentLevel;
  
  // Create monkey
  monkey = createMonkey();
  
  // Initialize UI
  updateLivesDisplay();
  updateComboDisplay();
  updateLevelProgress();
  updateTimeRequirement();
  
  // Apply settings (now that they're loaded)
  applySettings();
  
  // Setup resize handler
  setupResizeHandler();
  
  // Initialize daily challenges
  initializeDailyChallenges();
  
  // Show tutorial for new players
  if (!tutorialCompleted) {
    showTutorial();
  }
  
  // Show level intro (don't start game automatically)
  showLevelIntro();
}

function isMobile() {
  return window.innerWidth < 768;
}

// Helper function for responsive alerts
function getResponsiveAlertConfig(baseConfig) {
  const mobile = isMobile();
  return {
    ...baseConfig,
    width: mobile ? "95vw" : (baseConfig.width || "85vw"),
    padding: mobile ? "15px" : undefined,
    customClass: {
      ...baseConfig.customClass,
      popup: mobile ? "swal2-popup-mobile" : baseConfig.customClass?.popup
    }
  };
}

function createMonkey() {
    const monkey = document.createElement("img");
    monkey.src = "images/monkey.gif";
    monkey.className = "monkey";
    gameContainer.append(monkey);
  
  // Position monkey at bottom center
  positionMonkey();
  
  // Reposition on resize
  window.addEventListener('resize', positionMonkey);
  
    return monkey;
}

function positionMonkey() {
  if (!monkey || !gameContainer) return;
  
  const monkeyHeight = isMobile() ? 45 : 80;
  const monkeyWidth = isMobile() ? 45 : 80;
  
  monkey.style.height = monkeyHeight + 'px';
  monkey.style.width = monkeyWidth + 'px';
  monkey.style.bottom = '0px';
  monkey.style.left = '50%';
  monkey.style.transform = 'translateX(-50%)';
  monkey.style.position = 'absolute';
}

function applySettings() {
  if (sounds.gameTheme) {
    sounds.gameTheme.volume = settings.musicVolume || 1;
    if (!settings.musicEnabled) {
      sounds.gameTheme.pause();
    }
  }
}
// ==================== LEVEL SYSTEM ====================
function getLevelSettings() {
  const level = levelConfig.currentLevel;
  const baseSettings = difficultySettings[user.difficulty];
  const levelMultiplier = 1 + (level * 0.15);
  const spawnMultiplier = 1 + (level * 0.1);
  const isBoss = levelConfig.isBossLevel(level);
  
  return {
    fruitSpeed: Math.max(500, baseSettings.fruitSpeed / levelMultiplier),
    spawnInterval: Math.max(1000, baseSettings.spawnInterval / spawnMultiplier),
    bombFrequency: isBoss ? 0.3 : 0.1,
    goldenFrequency: 0.15 + (level * 0.01),
    powerupFrequency: 0.05,
    isBoss: isBoss
  };
}

function checkLevelCompletion() {
  const requirement = levelConfig.getLevelRequirement(levelConfig.currentLevel);
  const elapsedTime = (minutes * 60) + seconds - levelConfig.levelStartTime;
  
  const scoreProgress = Math.min(100, (levelScore / requirement.score) * 100);
  const timeProgress = Math.min(100, (elapsedTime / requirement.time) * 100);
  const totalProgress = (scoreProgress + timeProgress) / 2;
  
  updateLevelProgress(totalProgress);
  
  if (levelScore >= requirement.score && elapsedTime >= requirement.time) {
    completeLevel();
  }
}

function completeLevel() {
  stopAllIntervals();
  checkAchievements();
  
  const isBoss = levelConfig.isBossLevel(levelConfig.currentLevel);
  const requirement = levelConfig.getLevelRequirement(levelConfig.currentLevel);
  
  // Update statistics
  statistics.levelsCompleted++;
  if (lives === 3) {
    statistics.perfectLevels++;
  }
  const elapsedTime = (minutes * 60) + seconds - levelConfig.levelStartTime;
  statistics.totalPlayTime += elapsedTime;
  setLocalStorage("statistics", statistics);
  
  // Update user progress
  user.highestLevel = Math.max(user.highestLevel, levelConfig.currentLevel);
  user.totalScore += levelScore;
  saveUserData();
  
  // Show level complete screen
  const mobile = isMobile();
  Swal.fire(getResponsiveAlertConfig({
    title: isBoss ? `BOSS LEVEL COMPLETE! 🎉` : `Level ${levelConfig.currentLevel} Complete! 🎉`,
    html: `
      <div style="text-align: center; font-size: ${mobile ? '0.9rem' : '1rem'};">
        <p style="margin: ${mobile ? '5px 0' : '10px 0'}">Score: ${levelScore} / ${requirement.score}</p>
        <p style="margin: ${mobile ? '5px 0' : '10px 0'}">Time: ${Math.floor((minutes * 60 + seconds - levelConfig.levelStartTime))}s</p>
        <p style="margin: ${mobile ? '5px 0' : '10px 0'}">Lives Remaining: ${lives}</p>
        <p style="margin: ${mobile ? '5px 0' : '10px 0'}">Max Combo: ${combo}x</p>
      </div>
    `,
    confirmButtonText: "Next Level",
    confirmButtonColor: "darkgreen",
    color: "orangered",
    background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    allowOutsideClick: false,
    buttonsStyling: false,
    customClass: {
      confirmButton: "playAgain",
      title: "swal-title",
    },
  })).then(() => {
    nextLevel();
  });
}

function nextLevel() {
  levelConfig.currentLevel++;
  levelScore = 0;
  levelConfig.levelStartTime = (minutes * 60) + seconds;
  combo = 0;
  comboMultiplierValue = 1;
  activePowerups = {};
  updatePowerupIndicators();
  
  if (levelDisplay) levelDisplay.textContent = levelConfig.currentLevel;
  updateLevelProgress(0);
  updateTimeRequirement();
  
  showLevelIntro();
}

function showLevelIntro() {
  const isBoss = levelConfig.isBossLevel(levelConfig.currentLevel);
  const requirement = levelConfig.getLevelRequirement(levelConfig.currentLevel);
  const mobile = isMobile();
  
  Swal.fire(getResponsiveAlertConfig({
    title: isBoss ? `BOSS LEVEL ${levelConfig.currentLevel}! 👹` : `Level ${levelConfig.currentLevel}`,
    html: `
      <div style="text-align: center; font-size: ${mobile ? '0.9rem' : '1rem'};">
        <p style="margin: ${mobile ? '5px 0' : '10px 0'}"><strong>Requirements:</strong></p>
        <p style="margin: ${mobile ? '5px 0' : '10px 0'}">Score: ${requirement.score} points</p>
        <p style="margin: ${mobile ? '5px 0' : '10px 0'}">Survive: ${requirement.time} seconds</p>
        ${isBoss ? `<p style="color: red; font-weight: bold; margin: ${mobile ? '5px 0' : '10px 0'}; font-size: ${mobile ? '0.9rem' : '1rem'};">BOSS LEVEL - EXTREME DIFFICULTY!</p>` : ''}
      </div>
    `,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    color: "orangered",
    background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    customClass: {
      title: "swal-title",
    },
  })).then(() => {
    startLevel();
  });
}

function startLevel() {
  isGameActive = true;
  levelConfig.levelStartTime = (minutes * 60) + seconds;
  lives = 3;
  updateLivesDisplay();
  updateTimeRequirement();
  startGame();
}

function updateTimeRequirement() {
  if (timeRequirement) {
    const requirement = levelConfig.getLevelRequirement(levelConfig.currentLevel);
    const minutesReq = Math.floor(requirement.time / 60);
    const secondsReq = requirement.time % 60;
    
    if (minutesReq > 0) {
      timeRequirement.textContent = `of ${minutesReq}:${secondsReq < 10 ? '0' : ''}${secondsReq} Minutes`;
    } else {
      timeRequirement.textContent = `of ${requirement.time} seconds`;
    }
  }
}

function updateLevelProgress(percent) {
  if (levelProgressBar) {
    levelProgressBar.style.width = `${percent}%`;
  }
}

// ==================== LIVES SYSTEM ====================
function loseLife() {
  if (activePowerups[POWERUPS.SHIELD]) {
    deactivatePowerup(POWERUPS.SHIELD);
    createParticleEffect(monkey.offsetLeft + monkey.clientWidth / 2, monkey.offsetTop, 'shield');
    return;
  }
  
  lives--;
  updateLivesDisplay();
  screenShake();
  
  if (lives <= 0) {
    gameOver();
  } else {
    // Brief invincibility
    monkey.style.opacity = '0.5';
    setTimeout(() => {
      if (monkey) monkey.style.opacity = '1';
    }, 1000);
  }
}

function updateLivesDisplay() {
  if (!livesDisplay) return;
  const hearts = livesDisplay.querySelectorAll('.fas.fa-heart');
  hearts.forEach((heart, index) => {
    if (index < lives) {
      heart.style.opacity = '1';
      heart.style.color = 'red';
    } else {
      heart.style.opacity = '0.3';
      heart.style.color = 'gray';
    }
  });
}

// ==================== COMBO SYSTEM ====================
function incrementCombo() {
  combo++;
  lastComboTime = Date.now();
  
  // Calculate multiplier
  if (combo >= 20) comboMultiplierValue = 3;
  else if (combo >= 10) comboMultiplierValue = 2;
  else if (combo >= 5) comboMultiplierValue = 1.5;
  else if (combo >= 3) comboMultiplierValue = 1.2;
  else comboMultiplierValue = 1;
  
  updateComboDisplay();
  startComboDecayTimer();
  
  // Check achievement
  if (combo === 20) {
    unlockAchievement(ACHIEVEMENTS.COMBO_MASTER);
  }
  
  // Play combo sound at milestones
  if (combo === 5 || combo === 10 || combo === 20) {
    if (sounds.addScore) {
      sounds.addScore.currentTime = 0;
      sounds.addScore.play().catch(() => {});
    }
  }
}

function resetCombo() {
  combo = 0;
  comboMultiplierValue = 1;
  lastComboTime = 0;
  updateComboDisplay();
  stopComboDecayTimer();
}

function startComboDecayTimer() {
  stopComboDecayTimer();
  comboDecayTimer = setInterval(() => {
    const timeSinceLastCombo = Date.now() - lastComboTime;
    if (timeSinceLastCombo >= COMBO_DECAY_TIME && combo > 0) {
      resetCombo();
    }
  }, 100);
}

function stopComboDecayTimer() {
  if (comboDecayTimer) {
    clearInterval(comboDecayTimer);
    comboDecayTimer = null;
  }
}

function updateComboDisplay() {
  if (comboDisplay) {
    comboDisplay.textContent = combo;
    if (comboMultiplierValue > 1 && comboMultiplier) {
      comboMultiplier.textContent = `${comboMultiplierValue.toFixed(1)}x`;
      comboMultiplier.style.display = 'inline';
    } else if (comboMultiplier) {
      comboMultiplier.style.display = 'none';
    }
  }
}

// ==================== POWER-UP SYSTEM ====================
let powerupUpdateInterval = null;
let magnetAttractionDistance = 150; // pixels

function activatePowerup(type) {
  activePowerups[type] = {
    startTime: Date.now(),
    duration: getPowerupDuration(type)
  };
  updatePowerupIndicators();
  
  // Visual effect
  if (monkey) {
    const rect = monkey.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    createParticleEffect(
      rect.left - containerRect.left + rect.width / 2,
      rect.top - containerRect.top + rect.height / 2,
      'powerup'
    );
  }
  
  // Play activation sound if available
  if (sounds.addScore) {
    sounds.addScore.currentTime = 0;
    sounds.addScore.volume = settings.soundVolume || 1;
    sounds.addScore.play().catch(() => {});
  }
  
  switch(type) {
    case POWERUPS.MULTI_SHOT:
      // Already handled in shootStone
      break;
    case POWERUPS.RAPID_FIRE:
      // Shooting speed handled in shootStone via canShoot
      break;
    case POWERUPS.SLOW_MOTION:
      // Apply slow motion to all existing fruits
      applySlowMotion();
      break;
    case POWERUPS.MAGNET:
      // Start magnet effect
      startMagnetEffect();
      break;
    case POWERUPS.SHIELD:
      // Visual indicator added in updatePowerupIndicators
      if (monkey) {
        monkey.style.filter = 'drop-shadow(0 0 10px #4ecdc4)';
      }
      break;
  }
  
  // Start powerup update interval if not already running
  if (!powerupUpdateInterval) {
    powerupUpdateInterval = setInterval(() => {
      updatePowerupTimers();
    }, 100);
  }
}

function deactivatePowerup(type) {
  delete activePowerups[type];
  updatePowerupIndicators();
  
  switch(type) {
    case POWERUPS.SLOW_MOTION:
      // Restore normal speed
      restoreNormalSpeed();
      break;
    case POWERUPS.MAGNET:
      // Stop magnet effect
      stopMagnetEffect();
      break;
    case POWERUPS.SHIELD:
      if (monkey) {
        monkey.style.filter = '';
      }
      break;
  }
  
  // Stop update interval if no powerups active
  if (Object.keys(activePowerups).length === 0 && powerupUpdateInterval) {
    clearInterval(powerupUpdateInterval);
    powerupUpdateInterval = null;
  }
}

function updatePowerupTimers() {
  const now = Date.now();
  Object.keys(activePowerups).forEach(type => {
    const powerup = activePowerups[type];
    if (powerup.duration !== Infinity && (now - powerup.startTime) >= powerup.duration) {
      deactivatePowerup(type);
    }
  });
  updatePowerupIndicators();
}

function applySlowMotion() {
  // Slow down all existing fruit intervals
  const levelSettings = getLevelSettings();
  imagesArray.forEach(row => {
    row.forEach(fruit => {
      if (fruit && fruit.dataset.originalSpeed === undefined) {
        fruit.dataset.originalSpeed = levelSettings.fruitSpeed;
        // Speed is handled in moveFruitDown function
      }
    });
  });
}

function restoreNormalSpeed() {
  // Speed restoration handled in moveFruitDown
}

function startMagnetEffect() {
  // Magnet effect applied in moveFruitDown
}

function stopMagnetEffect() {
  // Cleanup handled automatically
}

function getPowerupDuration(type) {
  const durations = {
    [POWERUPS.MULTI_SHOT]: 15000,
    [POWERUPS.RAPID_FIRE]: 20000,
    [POWERUPS.SLOW_MOTION]: 10000,
    [POWERUPS.SCORE_MULTIPLIER]: 30000,
    [POWERUPS.SHIELD]: Infinity, // One-time use
    [POWERUPS.MAGNET]: 15000,
    [POWERUPS.EXTRA_LIFE]: 0 // Instant
  };
  return durations[type] || 0;
}

function updatePowerupIndicators() {
  if (!powerupIndicators) return;
  powerupIndicators.innerHTML = '';
  
  Object.keys(activePowerups).forEach(type => {
    const powerup = activePowerups[type];
    if (powerup.duration === Infinity) return; // Shield is one-time
    
    const indicator = document.createElement('div');
    indicator.className = 'powerup-indicator';
    indicator.innerHTML = `<i class="fas fa-${getPowerupIcon(type)}"></i><span>${Math.ceil((powerup.duration - (Date.now() - powerup.startTime)) / 1000)}s</span>`;
    powerupIndicators.appendChild(indicator);
    
    // Check if expired
    if (Date.now() - powerup.startTime >= powerup.duration) {
      deactivatePowerup(type);
    }
  });
}

function getPowerupIcon(type) {
  const icons = {
    [POWERUPS.MULTI_SHOT]: 'crosshairs',
    [POWERUPS.RAPID_FIRE]: 'bolt',
    [POWERUPS.SLOW_MOTION]: 'clock',
    [POWERUPS.SCORE_MULTIPLIER]: 'star',
    [POWERUPS.MAGNET]: 'magnet'
  };
  return icons[type] || 'star';
}

// ==================== ACHIEVEMENT SYSTEM ====================
function unlockAchievement(achievement) {
  if (achievements.find(a => a.id === achievement.id)) return;
  
  achievements.push({ id: achievement.id, name: achievement.name, unlockedAt: Date.now() });
  setLocalStorage("achievements", achievements);
  
  // Show notification
  const mobile = isMobile();
  Swal.fire({
    title: 'Achievement Unlocked!',
    text: achievement.name,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: mobile ? 'top' : 'top-end',
    width: mobile ? '90vw' : 'auto',
    customClass: {
      popup: mobile ? 'swal2-toast-mobile' : ''
    }
  });
}

function checkAchievements() {
  // Score achievements
  if (score >= 5000 && !achievements.find(a => a.id === ACHIEVEMENTS.SCORE_5000.id)) {
    unlockAchievement(ACHIEVEMENTS.SCORE_5000);
  } else if (score >= 1000 && !achievements.find(a => a.id === ACHIEVEMENTS.SCORE_1000.id)) {
    unlockAchievement(ACHIEVEMENTS.SCORE_1000);
  } else if (score >= 500 && !achievements.find(a => a.id === ACHIEVEMENTS.SCORE_500.id)) {
    unlockAchievement(ACHIEVEMENTS.SCORE_500);
  } else if (score >= 100 && !achievements.find(a => a.id === ACHIEVEMENTS.SCORE_100.id)) {
    unlockAchievement(ACHIEVEMENTS.SCORE_100);
  }
  
  // Level achievements
  if (levelConfig.currentLevel === 10) {
    unlockAchievement(ACHIEVEMENTS.LEVEL_10);
  }
  
  // Perfect level
  if (lives === 3) {
    unlockAchievement(ACHIEVEMENTS.PERFECT_LEVEL);
  }
  
  // Speed demon
  const elapsedTime = (minutes * 60) + seconds - levelConfig.levelStartTime;
  if (elapsedTime < 30) {
    unlockAchievement(ACHIEVEMENTS.SPEED_DEMON);
  }
  if (elapsedTime < 20) {
    unlockAchievement(ACHIEVEMENTS.TIME_TRIAL);
  }
  
  // Statistics-based achievements
  if (statistics.totalBananas >= 100 && !achievements.find(a => a.id === ACHIEVEMENTS.BANANA_COLLECTOR.id)) {
    unlockAchievement(ACHIEVEMENTS.BANANA_COLLECTOR);
  }
  if (statistics.totalGolden >= 50 && !achievements.find(a => a.id === ACHIEVEMENTS.GOLDEN_HUNTER.id)) {
    unlockAchievement(ACHIEVEMENTS.GOLDEN_HUNTER);
  }
  if (statistics.levelsCompleted >= 20 && !achievements.find(a => a.id === ACHIEVEMENTS.SURVIVOR.id)) {
    unlockAchievement(ACHIEVEMENTS.SURVIVOR);
  }
  if (statistics.perfectLevels >= 5 && !achievements.find(a => a.id === ACHIEVEMENTS.STREAK_MASTER.id)) {
    unlockAchievement(ACHIEVEMENTS.STREAK_MASTER);
  }
  if (statistics.totalPlayTime >= 3600 && !achievements.find(a => a.id === ACHIEVEMENTS.MARATHON.id)) {
    unlockAchievement(ACHIEVEMENTS.MARATHON);
  }
  
  // Accuracy achievement
  if (statistics.totalShots > 0) {
    const accuracy = (statistics.totalHits / statistics.totalShots) * 100;
    if (accuracy >= 80 && !achievements.find(a => a.id === ACHIEVEMENTS.PERFECT_SHOT.id)) {
      unlockAchievement(ACHIEVEMENTS.PERFECT_SHOT);
    }
  }
  
  // Combo achievements
  if (combo >= 50 && !achievements.find(a => a.id === ACHIEVEMENTS.COMBO_KING.id)) {
    unlockAchievement(ACHIEVEMENTS.COMBO_KING);
  }
  
  // Boss level achievements
  const bossLevelsCompleted = levelConfig.bossLevels.filter(level => level < levelConfig.currentLevel).length;
  if (bossLevelsCompleted >= 5 && !achievements.find(a => a.id === ACHIEVEMENTS.BOSS_SLAYER.id)) {
    unlockAchievement(ACHIEVEMENTS.BOSS_SLAYER);
  }
}

// ==================== PARTICLE EFFECTS ====================
let particlePool = [];
const MAX_PARTICLES = 100;

function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.pointerEvents = 'none';
  return particle;
}

function getParticleFromPool() {
  if (particlePool.length > 0) {
    return particlePool.pop();
  }
  return createParticle();
}

function returnParticleToPool(particle) {
  particle.style.opacity = '0';
  particle.style.transform = '';
  particle.style.backgroundColor = '';
  if (particlePool.length < MAX_PARTICLES) {
    particlePool.push(particle);
  } else {
    particle.remove();
  }
}

function createParticleEffect(x, y, type = 'explosion') {
  const colors = {
    explosion: ['#ff6b6b', '#ffd93d', '#ff6b6b', '#ff8c42'],
    hit: ['#ffd93d', '#ff6b6b', '#ffa500'],
    shield: ['#4ecdc4', '#95e1d3', '#00d4ff'],
    powerup: ['#9b59b6', '#e74c3c', '#f39c12', '#1abc9c']
  };
  
  const particleColors = colors[type] || colors.explosion;
  const particleCount = type === 'explosion' ? 20 : 12;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = getParticleFromPool();
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = particleColors[Math.floor(Math.random() * particleColors.length)];
    particle.style.opacity = '1';
    gameContainer.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 2 + Math.random() * 4;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let px = x;
    let py = y;
    let opacity = 1;
    let scale = 1;
    
    const animate = () => {
      px += vx;
      py += vy;
      opacity -= 0.03;
      scale -= 0.02;
      
      particle.style.left = px + 'px';
      particle.style.top = py + 'px';
      particle.style.opacity = opacity;
      particle.style.transform = `scale(${Math.max(0, scale)})`;
      
      if (opacity <= 0) {
        returnParticleToPool(particle);
      } else {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}

function screenShake() {
  gameContainer.style.animation = 'shake 0.5s';
  setTimeout(() => {
    gameContainer.style.animation = '';
  }, 500);
}

// ==================== LEADERBOARD ====================
function updateLeaderboard() {
  leaderboard.push({
    name: user.name,
    score: score,
    level: levelConfig.currentLevel,
    date: Date.now()
  });
  
  leaderboard.sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.score - a.score;
  });
  
  leaderboard = leaderboard.slice(0, 10);
  setLocalStorage("leaderboard", leaderboard);
}

// ==================== DATA PERSISTENCE ====================
function saveUserData() {
  user.currentLevel = levelConfig.currentLevel;
  user.score = score;
  setLocalStorage("user", user);
}

// ==================== PAUSE SYSTEM ====================
function togglePause() {
  if (!isGameActive) return;
  
  isPaused = !isPaused;
  
  if (isPaused) {
    pauseOverlay?.classList.remove('hidden');
    stopAllIntervals();
  } else {
    pauseOverlay?.classList.add('hidden');
    startGame();
  }
}

// ==================== CONTROLS ====================
document.onkeydown = function (event) {
  if (isPaused) {
    if (event.key === 'Escape' || event.key === 'p' || event.key === 'P') {
      togglePause();
    }
    return;
  }
  
  if (event.key === 'Escape' || event.key === 'p' || event.key === 'P') {
    togglePause();
    return;
  }
  
  let currentPosition = monkey.offsetLeft;
  const moveSpeed = 40 * (settings.controlSensitivity || 1);
  
  if (event.key == "ArrowLeft" && currentPosition > 20) {
    currentPosition -= moveSpeed;
    monkey.style.left = currentPosition + "px";
  } else if (
    event.key == "ArrowRight" &&
    currentPosition < gameContainer.clientWidth - monkey.clientWidth - 20
  ) {
    currentPosition += moveSpeed;
    monkey.style.left = currentPosition + "px";
  } else if (event.key == " " && !isPaused) {
    if (canShoot) {
      shootStone();
      const shootCooldown = activePowerups[POWERUPS.RAPID_FIRE] ? 200 : 500;
      canShoot = false;
      if (shootIndicator) shootIndicator.style.backgroundColor = "red";
      setTimeout(() => {
        canShoot = true;
        if (shootIndicator) shootIndicator.style.backgroundColor = "green";
      }, shootCooldown);
    }
  }
};
// Create Fruit Object
const createFruitObject = function (src, leftPosition) {
  const fruitObject = document.createElement("img");
  fruitObject.src = `images/${src}`;
  fruitObject.classList.add("banana");
  fruitObject.style.left = leftPosition + "vw";
  return fruitObject;
};
// Move Created Fruit Downwards
const moveFruitDown = function (fruitObject) {
  let topPosition = 0;
  const levelSettings = getLevelSettings();
  let baseSpeed = levelSettings.fruitSpeed;
  if (fruitObject.dataset.originalSpeed) {
    baseSpeed = parseInt(fruitObject.dataset.originalSpeed);
  }
  const speed = activePowerups[POWERUPS.SLOW_MOTION] ? baseSpeed * 2 : baseSpeed;
  
  const moveDownInterval = setInterval(function () {
    if (isPaused) return;
    
    // Apply magnet effect if active
    if (activePowerups[POWERUPS.MAGNET] && monkey && !fruitObject.src.includes("bomb")) {
      const fruitRect = fruitObject.getBoundingClientRect();
      const monkeyRect = monkey.getBoundingClientRect();
      const fruitCenterX = fruitRect.left + fruitRect.width / 2;
      const monkeyCenterX = monkeyRect.left + monkeyRect.width / 2;
      const distance = Math.abs(fruitCenterX - monkeyCenterX);
      
      if (distance < magnetAttractionDistance) {
        const attraction = (magnetAttractionDistance - distance) / magnetAttractionDistance;
        const moveX = (monkeyCenterX - fruitCenterX) * attraction * 0.1;
        const currentLeft = parseFloat(fruitObject.style.left) || 0;
        fruitObject.style.left = (currentLeft + moveX) + "px";
      }
    }
    
    topPosition += 100;
    fruitObject.style.top = topPosition + "px";
    
    if (
      fruitObject.offsetTop >=
      monkey.offsetTop - fruitObject.clientHeight + 15
    ) {
      clearInterval(moveDownInterval);
      // Remove from intervals array
      const index = fruitIntervals.indexOf(moveDownInterval);
      if (index > -1) {
        fruitIntervals.splice(index, 1);
      }
      fruitObject.remove();
      resetCombo();
      
      // Handle different fruit types
      if (fruitObject.dataset.fruitType === 'poison') {
        // Poison fruit: lose 2 lives
        lives = Math.max(0, lives - 2);
        updateLivesDisplay();
        if (lives <= 0) {
          gameOver();
        } else {
          screenShake();
        }
      } else if (fruitObject.dataset.fruitType === 'bonus') {
        // Bonus fruit: no penalty, just reset combo
        // Could add bonus points here
      } else {
        loseLife();
      }
    }
  }, speed);
  
  fruitIntervals.push(moveDownInterval);
};
// Creates Objects and Position It
const createMovingDownObjects = function (array) {
  if (isPaused) return;
  
  const row = [];
  let leftPosition = 5;
  let totalFruits = isMobile() ? 6 : 9;
  let spacing = isMobile() ? 12 : 8;
  const levelSettings = getLevelSettings();
  
  // Create fruit array with probabilities
  let fruitArray = [];
  const poisonFrequency = levelSettings.bombFrequency * 0.3; // 30% of bomb frequency
  const bonusFrequency = levelSettings.goldenFrequency * 0.4; // 40% of golden frequency
  
  for (let i = 0; i < totalFruits; i++) {
    const rand = Math.random();
    if (rand < levelSettings.bombFrequency) {
      // Decide between bomb and poison
      if (rand < poisonFrequency) {
        fruitArray.push({ type: "poison", src: "bomb.gif" });
      } else {
        fruitArray.push("bomb.gif");
      }
    } else if (rand < levelSettings.bombFrequency + levelSettings.goldenFrequency) {
      // Decide between golden and bonus
      if (rand < levelSettings.bombFrequency + bonusFrequency) {
        fruitArray.push({ type: "bonus", src: "golden.png" });
      } else {
        fruitArray.push("golden.png");
      }
    } else if (rand < levelSettings.bombFrequency + levelSettings.goldenFrequency + levelSettings.powerupFrequency) {
      // Power-up
      const powerupTypes = [POWERUPS.MULTI_SHOT, POWERUPS.RAPID_FIRE, POWERUPS.SLOW_MOTION, 
                           POWERUPS.SCORE_MULTIPLIER, POWERUPS.SHIELD, POWERUPS.MAGNET, POWERUPS.EXTRA_LIFE];
      const powerupType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
      const powerupFruit = createPowerupFruit(powerupType, leftPosition);
      gameContainer.append(powerupFruit);
      row.push(powerupFruit);
      moveFruitDown(powerupFruit);
      leftPosition += spacing;
      continue;
    } else {
      fruitArray.push("banana.png");
    }
  }
  
  let shuffledSources = shuffleArray(fruitArray);
  
  //Creates One Moving Down Row
  for (let i = 0; i < totalFruits; i++) {
    if (shuffledSources[i]) {
      let fruitSrc = shuffledSources[i];
      let fruitType = null;
      
      // Handle special fruit types
      if (typeof shuffledSources[i] === 'object') {
        fruitSrc = shuffledSources[i].src;
        fruitType = shuffledSources[i].type;
      }
      
      const fruitObject = createFruitObject(fruitSrc, leftPosition);
      if (fruitType) {
        fruitObject.dataset.fruitType = fruitType;
        if (fruitType === 'poison') {
          fruitObject.style.filter = 'hue-rotate(120deg) brightness(0.8)';
        } else if (fruitType === 'bonus') {
          fruitObject.style.filter = 'hue-rotate(60deg) brightness(1.2) drop-shadow(0 0 10px #ffd700)';
        }
      }
      leftPosition += spacing;
      gameContainer.append(fruitObject);
      row.push(fruitObject);
      moveFruitDown(fruitObject);
    }
  }
  imagesArray.push(row);
};

function createPowerupFruit(type, leftPosition) {
  const powerupFruit = document.createElement("img");
  powerupFruit.src = "images/golden.png"; // Use golden as base
  powerupFruit.classList.add("banana", "powerup");
  powerupFruit.style.left = leftPosition + "vw";
  powerupFruit.dataset.powerup = type;
  powerupFruit.style.filter = "hue-rotate(180deg)";
  return powerupFruit;
}
// Create Stone
function createStone(stonePosition) {
  const stone = document.createElement("img");
  stone.src = "images/stone.png";
  stone.classList.add("stone");
  stone.style.left = `${monkey.offsetLeft + monkey.clientWidth / 2 - 10}px`;
  stone.style.top = `${stonePosition}px`;
  return stone;
}
//Shoot Stone From The Monkey
const shootStone = function () {
  statistics.totalShots++;
  setLocalStorage("statistics", statistics);
  
  if (activePowerups[POWERUPS.MULTI_SHOT]) {
    // Shoot 3 stones
    for (let i = -1; i <= 1; i++) {
  let stonePosition = monkey.offsetTop;
  const stone = createStone(stonePosition);
      stone.style.left = `${monkey.offsetLeft + monkey.clientWidth / 2 - 10 + (i * 20)}px`;
      if (sounds.shotBomb) {
        sounds.shotBomb.volume = settings.soundVolume || 1;
        sounds.shotBomb.play().catch(() => {});
      }
  gameContainer.append(stone);
  moveStoneUp(stone, stonePosition);
    }
  } else {
    let stonePosition = monkey.offsetTop;
    const stone = createStone(stonePosition);
    if (sounds.shotBomb) {
      sounds.shotBomb.volume = settings.soundVolume || 1;
      sounds.shotBomb.play().catch(() => {});
    }
    gameContainer.append(stone);
    moveStoneUp(stone, stonePosition);
  }
};
//Move Stone Up
const moveStoneUp = function (stone, stonePosition) {
  const stoneInterval = setInterval(() => {
    if (stonePosition <= gameContainer.offsetTop - 40) {
      clearInterval(stoneInterval);
      stone.remove();
    } else {
      stonePosition = stone.offsetTop;
      stonePosition -= 20;
      stone.style.top = `${stonePosition}px`;
      checkCollision(stone);
    }
  }, 10);
};
// Collision Detection (Optimized)
const checkCollision = function (stone) {
  // Helper Function - optimized collision detection
  const isOverlapping = (rect1, rect2) => {
    // Early exit for non-overlapping cases
    if (rect1.right < rect2.left || rect1.left > rect2.right) return false;
    if (rect1.bottom < rect2.top || rect1.top > rect2.bottom) return false;
    return true;
  };
  
  const stoneRect = stone.getBoundingClientRect();
  const stoneCenterX = stoneRect.left + stoneRect.width / 2;
  const stoneCenterY = stoneRect.top + stoneRect.height / 2;
  
  // Only check fruits near the stone's position
  imagesArray.forEach((row, i) => {
    if (!row) return;
    row.forEach((fruit, j) => {
      if (fruit && fruit.parentNode) {
        const fruitRect = fruit.getBoundingClientRect();
        // Quick distance check before detailed collision
        const dx = (fruitRect.left + fruitRect.width / 2) - stoneCenterX;
        const dy = (fruitRect.top + fruitRect.height / 2) - stoneCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = Math.max(stoneRect.width, stoneRect.height) + Math.max(fruitRect.width, fruitRect.height);
        
        if (distance < maxDistance && isOverlapping(stoneRect, fruitRect)) {
          stone.remove();
          handleCollision(fruit, i, j);
          return; // Exit early after collision
        }
      }
    });
  });
};
// Handle Collision
const handleCollision = function (imgObj, i, j) {
  const rect = imgObj.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  if (imgObj.src.includes("banana.png")) {
    imgObj.remove();
    imagesArray[i][j] = null;
    
    statistics.totalBananas++;
    statistics.totalHits++;
    if (combo > statistics.bestCombo) {
      statistics.bestCombo = combo;
    }
    setLocalStorage("statistics", statistics);
    
    let points = 1;
    if (activePowerups[POWERUPS.SCORE_MULTIPLIER]) points *= 2;
    points = Math.floor(points * comboMultiplierValue);
    
    levelScore += points;
    score += points;
    statistics.totalScore += points;
    
    incrementCombo();
    trackScore(score);
    createParticleEffect(x, y, 'hit');
    createScorePopup(x, y, points);
    
    if (sounds.addScore) {
      sounds.addScore.volume = settings.soundVolume || 1;
      sounds.addScore.play().catch(() => {});
    }
    
    // First banana achievement
    if (statistics.totalBananas === 1 && !achievements.find(a => a.id === ACHIEVEMENTS.FIRST_BANANA.id)) {
      unlockAchievement(ACHIEVEMENTS.FIRST_BANANA);
    }
    
    checkLevelCompletion();
  } else if (imgObj.src.includes("golden.png")) {
    imgObj.remove();
    imagesArray[i][j] = null;
    
    // Check if it's a bonus fruit
    const isBonus = imgObj.dataset.fruitType === 'bonus';
    
    if (!isBonus) {
      statistics.totalGolden++;
    }
    statistics.totalHits++;
    if (combo > statistics.bestCombo) {
      statistics.bestCombo = combo;
    }
    setLocalStorage("statistics", statistics);
    
    let points = isBonus ? 5 : 2; // Bonus fruits worth more
    if (activePowerups[POWERUPS.SCORE_MULTIPLIER]) points *= 2;
    points = Math.floor(points * comboMultiplierValue);
    
    levelScore += points;
    score += points;
    statistics.totalScore += points;
    
    incrementCombo();
    trackScore(score);
    createParticleEffect(x, y, isBonus ? 'powerup' : 'hit');
    createScorePopup(x, y, points);
    
    if (sounds.golden) {
      sounds.golden.volume = settings.soundVolume || 1;
      sounds.golden.play().catch(() => {});
    }
    checkLevelCompletion();
  } else if (imgObj.src.includes("bomb.gif")) {
    const isPoison = imgObj.dataset.fruitType === 'poison';
    
    if (!isPoison) {
      removeSurroundingFruits(i, j);
      createParticleEffect(x, y, 'explosion');
      bombCount++;
      statistics.totalBombs++;
      setLocalStorage("statistics", statistics);
      
      if (bombCount === 50) {
        unlockAchievement(ACHIEVEMENTS.BOMB_EXPERT);
      }
      
      if (sounds.bomb) {
        sounds.bomb.volume = settings.soundVolume || 1;
        sounds.bomb.play().catch(() => {});
      }
    } else {
      // Poison fruit hit - lose life and reset combo
      imgObj.remove();
      imagesArray[i][j] = null;
      resetCombo();
      lives = Math.max(0, lives - 1);
      updateLivesDisplay();
      screenShake();
      createParticleEffect(x, y, 'explosion');
      
      if (lives <= 0) {
        gameOver();
      }
    }
  } else if (imgObj.src.includes("powerup")) {
    // Handle power-up collection
    const powerupType = imgObj.dataset.powerup;
    if (powerupType === POWERUPS.EXTRA_LIFE) {
      lives = Math.min(3, lives + 1);
      updateLivesDisplay();
    } else {
      activatePowerup(powerupType);
    }
    imgObj.remove();
    imagesArray[i][j] = null;
    createParticleEffect(x, y, 'hit');
  }
};

function createScorePopup(x, y, points) {
  const popup = document.createElement('div');
  popup.className = 'score-popup';
  popup.textContent = `+${points}`;
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  gameContainer.appendChild(popup);
  
  setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(-30px)';
    setTimeout(() => popup.remove(), 500);
  }, 100);
}

//********* Remove Objects Around The Bomb
const removeSurroundingFruits = function (i, j) {
  const indices = [
    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1], // Top Row  (i+ Becuase The Reversed Array In DOM)
    [i, j - 1],
    [i, j],
    [i, j + 1], // Current row
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1], // Bottom Row
  ];
  let pointsGained = 0;
  indices.forEach(([x, y]) => {
    if (
      x >= 0 &&
      x < imagesArray.length &&
      y >= 0 &&
      y < imagesArray[x]?.length
    ) {
      const fruit = imagesArray[x][y];
      if (fruit) {
        if (fruit.src.includes("banana.png")) {
          pointsGained += 1;
        } else if (fruit.src.includes("golden.png")) {
          pointsGained += 2;
        }
        fruit.remove();
        if (
          imagesArray[x] === undefined ||
          imagesArray[x][y] === undefined ||
          !imagesArray[x][y]
        )
          return;
        else imagesArray[x][y] = null;
      }
    }
  });
  
  // Apply multipliers
  if (activePowerups[POWERUPS.SCORE_MULTIPLIER]) pointsGained *= 2;
  pointsGained = Math.floor(pointsGained * comboMultiplierValue);
  
  // Update scores
  score += pointsGained;
  levelScore += pointsGained;
  trackScore(score);
  
  // Check level completion
  if (pointsGained > 0) {
    checkLevelCompletion();
  }
};

// Track Score & Handle Winning Score
const trackScore = function (score) {
  scoreObject.innerText = `SCORE : ${score < 10 ? "0" + score : score}`;
  // if (score >= 20) gameWin();
};

// Game Winning
const gameWin = function () {
  stopAllIntervals();
  user.score = score;
  localStorage.setItem("user", JSON.stringify(user));
  sounds.gameWinSound.play();
  //Sweealert2 A popup Js Library
  Swal.fire({
    title: `Awesome! 🎉\n${user.name}`,
    confirmButtonText: "Play Again!",
    text: `YOUR SCORE IS : ${score}`,
    confirmButtonColor: "darkgreen",
    imageUrl: "./images/monkey-win.gif",
    width: "85vw",
    color: "orangered",
    background:
      "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    allowOutsideClick: false,
    buttonsStyling: false,
    showCancelButton: true,
    customClass: {
      confirmButton: "playAgain",
      cancelButton: "playAgain cancel",
      title: "swal-title ",
      image: "winImg",
    },
  }).then((result) => {
    if (result.isDismissed) {
      location.replace("home-page.html");
    } else if (result.isConfirmed) {
      resetGame();
    }
  });
};

// Game Over
const gameOver = function () {
  stopAllIntervals();
  isGameActive = false;
  statistics.gamesPlayed++;
  const elapsedTime = (minutes * 60) + seconds - levelConfig.levelStartTime;
  statistics.totalPlayTime += elapsedTime;
  setLocalStorage("statistics", statistics);
  updateLeaderboard();
  saveUserData();
  
  if (sounds.gameOverSound) {
    sounds.gameOverSound.volume = settings.soundVolume || 1;
    sounds.gameOverSound.play().catch(() => {});
  }
  
  Swal.fire({
    title: "Game Over",
    html: `
      <div style="text-align: center;">
        <p>Level Reached: ${levelConfig.currentLevel}</p>
        <p>Final Score: ${score}</p>
        <p>Max Combo: ${combo}x</p>
      </div>
    `,
    confirmButtonText: "Retry Level",
    cancelButtonText: "Home",
    imageUrl: "./images/sad.gif",
    width: "85vw",
    color: "orangered",
    background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    allowOutsideClick: false,
    buttonsStyling: false,
    showCancelButton: true,
    customClass: {
      confirmButton: "playAgain",
      cancelButton: "playAgain cancel",
      title: "swal-title ",
    },
  }).then((result) => {
    if (result.isDismissed) {
      location.href = "home-page.html";
    } else if (result.isConfirmed) {
      resetLevel();
    }
  });
};

function resetLevel() {
  stopAllIntervals();
  levelScore = 0;
  score = 0;
  combo = 0;
  comboMultiplierValue = 1;
  lives = 3;
  activePowerups = {};
  seconds = 0;
  minutes = 0;
  levelConfig.levelStartTime = 0;
  trackScore(score);
  updateLivesDisplay();
  updateComboDisplay();
  updateLevelProgress(0);
  showLevelIntro();
}

// Reset Game (full reset)
const resetGame = function () {
  levelConfig.currentLevel = 1;
  resetLevel();
};

// Stop All Intervals
const stopAllIntervals = function () {
  const gameElements = gameContainer.querySelectorAll("img:not(.monkey)");
  gameElements.forEach((element) => element.remove());
  imagesArray = [];
  fruitIntervals.forEach(interval => {
    if (interval) clearInterval(interval);
  });
  fruitIntervals = [];
  if (gameInterval) clearInterval(gameInterval);
  if (stopWatchInterval) clearInterval(stopWatchInterval);
  if (powerupUpdateInterval) {
    clearInterval(powerupUpdateInterval);
    powerupUpdateInterval = null;
  }
  stopComboDecayTimer();
  if (mobileMoveInterval) {
    clearInterval(mobileMoveInterval);
    mobileMoveInterval = null;
  }
  gameInterval = null;
  stopWatchInterval = null;
};

// Control Stop Watch
const startStopWatch = function () {
  stopWatchInterval = setInterval(function () {
    if (isPaused) return;
    
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    
    if (stopWatch) {
    stopWatch.innerText = `${minutes < 10 ? "0" + minutes : minutes} : ${
      seconds < 10 ? "0" + seconds : seconds
    }`;
    }
    
    // Update powerup timers
    updatePowerupIndicators();
    
    // Check level completion
    if (isGameActive) {
      checkLevelCompletion();
      checkDailyChallenges();
    }
  }, 1000);
};

// Game Intervals
const startGame = function () {
  const levelSettings = getLevelSettings();
  gameInterval = setInterval(
    () => createMovingDownObjects(sources),
    levelSettings.spawnInterval
  );
  startStopWatch();
};

// ==================== MOBILE CONTROLS ====================
let mobileMoveInterval = null;
let isMovingLeft = false;
let isMovingRight = false;

function setupMobileControls() {
  const mobileControls = document.getElementById("mobile-controls");
  
  // Hide mobile controls on desktop, show on mobile
  function updateMobileControlsVisibility() {
    if (mobileControls) {
      if (isMobile()) {
        mobileControls.style.display = "flex";
      } else {
        mobileControls.style.display = "none";
      }
    }
  }
  
  // Initial check
  updateMobileControlsVisibility();
  
  // Update on resize
  window.addEventListener('resize', updateMobileControlsVisibility);
  
  const mobileLeft = document.getElementById("mobile-left");
  const mobileRight = document.getElementById("mobile-right");
  const mobileShoot = document.getElementById("mobile-shoot");
  
  function startMoving(direction) {
    if (isPaused || !monkey) return;
    
    if (direction === 'left') {
      isMovingLeft = true;
    } else if (direction === 'right') {
      isMovingRight = true;
    }
    
    if (!mobileMoveInterval) {
      mobileMoveInterval = setInterval(() => {
        if (isPaused || !monkey) {
          stopMoving();
          return;
        }
        
        let currentPosition = monkey.offsetLeft;
        const moveSpeed = 40 * (settings.controlSensitivity || 1);
        
        if (isMovingLeft && currentPosition > 20) {
          currentPosition -= moveSpeed;
          monkey.style.left = currentPosition + "px";
        } else if (isMovingRight && currentPosition < gameContainer.clientWidth - monkey.clientWidth - 20) {
          currentPosition += moveSpeed;
          monkey.style.left = currentPosition + "px";
        }
      }, 16); // ~60fps
    }
  }
  
  function stopMoving() {
    isMovingLeft = false;
    isMovingRight = false;
    if (mobileMoveInterval) {
      clearInterval(mobileMoveInterval);
      mobileMoveInterval = null;
    }
  }
  
  if (mobileLeft) {
    mobileLeft.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startMoving('left');
    });
    mobileLeft.addEventListener("touchend", (e) => {
      e.preventDefault();
      if (isMovingLeft) {
        isMovingLeft = false;
        if (!isMovingRight && mobileMoveInterval) {
          stopMoving();
        }
      }
    });
    mobileLeft.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      stopMoving();
    });
  }
  
  if (mobileRight) {
    mobileRight.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startMoving('right');
    });
    mobileRight.addEventListener("touchend", (e) => {
      e.preventDefault();
      if (isMovingRight) {
        isMovingRight = false;
        if (!isMovingLeft && mobileMoveInterval) {
          stopMoving();
        }
      }
    });
    mobileRight.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      stopMoving();
    });
  }
  
  if (mobileShoot) {
    mobileShoot.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (canShoot && !isPaused) {
        shootStone();
        const shootCooldown = activePowerups[POWERUPS.RAPID_FIRE] ? 200 : 500;
        canShoot = false;
        if (shootIndicator) shootIndicator.style.backgroundColor = "red";
        setTimeout(() => {
          canShoot = true;
          if (shootIndicator) shootIndicator.style.backgroundColor = "green";
        }, shootCooldown);
      }
    });
  }
}

// ==================== PAUSE MENU ====================
function setupPauseMenu() {
  if (pauseBtn) {
    pauseBtn.addEventListener("click", togglePause);
  }
  
  const resumeBtn = document.getElementById("resume-btn");
  const restartBtn = document.getElementById("restart-level-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const quitBtn = document.getElementById("quit-btn");
  
  if (resumeBtn) resumeBtn.addEventListener("click", togglePause);
  if (restartBtn) restartBtn.addEventListener("click", () => {
    togglePause();
    resetLevel();
  });
  if (settingsBtn) settingsBtn.addEventListener("click", () => {
    showSettingsMenu();
  });
  if (quitBtn) quitBtn.addEventListener("click", () => {
    location.href = "home-page.html";
  });
}

function showSettingsMenu() {
  const mobile = isMobile();
  Swal.fire({
    title: "⚙️ Settings",
    html: `
      <div style="text-align: center; font-size: ${mobile ? '0.9rem' : '1rem'};">
        <div style="margin: ${mobile ? '10px 0' : '15px 0'};">
          <label style="display: block; margin-bottom: 5px;">Music Volume: <span id="musicVolDisplay">${Math.round((settings.musicVolume || 1) * 100)}%</span></label>
          <input type="range" id="musicVol" min="0" max="100" value="${(settings.musicVolume || 1) * 100}" 
                 style="width: 100%; margin: 5px 0;">
        </div>
        <div style="margin: ${mobile ? '10px 0' : '15px 0'};">
          <label style="display: block; margin-bottom: 5px;">Sound Effects Volume: <span id="soundVolDisplay">${Math.round((settings.soundVolume || 1) * 100)}%</span></label>
          <input type="range" id="soundVol" min="0" max="100" value="${(settings.soundVolume || 1) * 100}" 
                 style="width: 100%; margin: 5px 0;">
        </div>
        <div style="margin: ${mobile ? '10px 0' : '15px 0'};">
          <label style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <input type="checkbox" id="musicEnabled" ${settings.musicEnabled !== false ? 'checked' : ''} style="width: 20px; height: 20px;">
            Enable Music
          </label>
        </div>
        <div style="margin: ${mobile ? '10px 0' : '15px 0'};">
          <label style="display: block; margin-bottom: 5px;">Control Sensitivity: <span id="sensDisplay">${settings.controlSensitivity || 1}x</span></label>
          <input type="range" id="controlSens" min="0.5" max="2" step="0.1" value="${settings.controlSensitivity || 1}" 
                 style="width: 100%; margin: 5px 0;">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    width: mobile ? "95vw" : "85vw",
    color: "orangered",
    background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    buttonsStyling: false,
    customClass: {
      confirmButton: "playAgain",
      cancelButton: "playAgain cancel",
      title: "swal-title",
    },
    didOpen: () => {
      const musicVol = document.getElementById("musicVol");
      const soundVol = document.getElementById("soundVol");
      const controlSens = document.getElementById("controlSens");
      
      if (musicVol) {
        musicVol.addEventListener("input", (e) => {
          document.getElementById("musicVolDisplay").textContent = e.target.value + "%";
        });
      }
      if (soundVol) {
        soundVol.addEventListener("input", (e) => {
          document.getElementById("soundVolDisplay").textContent = e.target.value + "%";
        });
      }
      if (controlSens) {
        controlSens.addEventListener("input", (e) => {
          document.getElementById("sensDisplay").textContent = parseFloat(e.target.value).toFixed(1) + "x";
        });
      }
    },
    preConfirm: () => {
      settings.musicVolume = document.getElementById("musicVol").value / 100;
      settings.soundVolume = document.getElementById("soundVol").value / 100;
      settings.musicEnabled = document.getElementById("musicEnabled").checked;
      settings.controlSensitivity = parseFloat(document.getElementById("controlSens").value);
      setLocalStorage("settings", settings);
      applySettings();
      
      // Update all sound volumes
      Object.values(sounds).forEach(sound => {
        if (sound && sound.volume !== undefined) {
          sound.volume = settings.soundVolume || 1;
        }
      });
      
      if (sounds.gameTheme) {
        sounds.gameTheme.volume = settings.musicVolume || 1;
        if (!settings.musicEnabled) {
          sounds.gameTheme.pause();
        } else if (isGameActive) {
          sounds.gameTheme.play().catch(() => {});
        }
      }
    }
  });
}

// ==================== FULLSCREEN ====================
function setupFullscreen() {
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (!fullscreenBtn) return;
  
  function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }
  
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  
  fullscreenBtn.addEventListener("click", () => {
    const icon = fullscreenBtn.querySelector("i");
    const isFull =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement;
    
    if (!isFull) {
      openFullscreen(document.documentElement);
      icon.classList.remove("fa-expand");
      icon.classList.add("fa-compress");
    } else {
      closeFullscreen();
      icon.classList.remove("fa-compress");
      icon.classList.add("fa-expand");
    }
  });
}

// ==================== INITIALIZE ON LOAD ====================
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
  setupMobileControls();
  setupPauseMenu();
  setupFullscreen();
  
  // Play theme music
  if (sounds.gameTheme && settings.musicEnabled) {
    sounds.gameTheme.volume = settings.musicVolume || 1;
    sounds.gameTheme.play().catch((error) => {});
  }
  document.body.addEventListener("click", () => {
    if (sounds.gameTheme && settings.musicEnabled) {
      sounds.gameTheme.volume = settings.musicVolume || 1;
      sounds.gameTheme.play().catch((error) => {});
    }
  });
});

// Utility Functions
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
// ******* Enhancements Features
let resizeHandler = null;

function setupResizeHandler() {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  resizeHandler = function () {
    if (monkey && gameContainer) {
      const monkeyHeight = isMobile() ? 45 : 80;
      const monkeyWidth = isMobile() ? 45 : 80;
      monkey.style.top = (gameContainer.clientHeight - monkeyHeight) + "px";
      monkey.style.left = (gameContainer.clientWidth / 2 - monkeyWidth / 2) + "px";
    }
  };
  window.addEventListener('resize', resizeHandler);
}

// Prevent Space (Event) From Exiting Fullscreen Mode
document.addEventListener("keydown", (event) => {
  if (document.fullscreenElement && event.code === "Space") {
    event.preventDefault();
  }
});
