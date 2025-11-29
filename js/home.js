const userNameTextBox = document.querySelector("#userName");
const playButton = document.querySelector("#playButton");
const errorUserName = document.querySelector("#errorUserName");
const startPage = document.querySelector("div.startPage");
const welcomeDiv = document.querySelector("div.welcomeDiv");
const welcome = document.querySelector("#welcome");
const startButton = document.querySelector("#startButton");
const howToPlayButton = document.querySelector("#howtoplay");
const tutorialBtn = document.getElementById("tutorial-btn");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const achievementsBtn = document.getElementById("achievements-btn");
const settingsMenuBtn = document.getElementById("settings-menu-btn");
const gameIntro = document.getElementById("game_intro");
const userLastScore = document.getElementById("lastscore");
const levelProgressInfo = document.getElementById("level-progress-info");
const user = {
    name: "",
    score: "",
    difficulty: "",
    currentLevel: 1,
    highestLevel: 1
}

// Load data
let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let settings = JSON.parse(localStorage.getItem("settings")) || {
  soundVolume: 1,
  musicVolume: 1,
  musicEnabled: true,
  controlSensitivity: 1
};

// Safe localStorage functions
function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing localStorage key "${key}":`, e);
  }
}

// Tutorial function
function showTutorial() {
  const mobile = window.innerWidth < 768;
  Swal.fire({
    title: "Welcome to Monkey Game! 🐵",
    html: `
      <div style="text-align: center; font-size: ${mobile ? '0.9rem' : '1rem'};">
        <p style="margin: ${mobile ? '8px 0' : '10px 0'}"><strong>Goal:</strong> Shoot bananas to score points!</p>
        <p style="margin: ${mobile ? '8px 0' : '10px 0'}"><strong>Controls:</strong></p>
        <p style="margin: ${mobile ? '5px 0' : '8px 0'}">${mobile ? 'Use buttons at bottom' : 'Arrow Keys to move, Space to shoot'}</p>
        <p style="margin: ${mobile ? '8px 0' : '10px 0'}"><strong>Tips:</strong></p>
        <ul style="margin: ${mobile ? '5px 0' : '10px 0'}; padding-left: ${mobile ? '20px' : '30px'};">
          <li>🍌 Bananas = 1 point</li>
          <li>⭐ Golden fruits = 2 points</li>
          <li>💣 Bombs explode nearby fruits</li>
          <li>🔥 Build combos for multipliers!</li>
          <li>💎 Collect power-ups for boosts</li>
          <li>⚠️ Poison fruits take 2 lives!</li>
          <li>🎁 Bonus fruits give extra points!</li>
        </ul>
        <p style="margin: ${mobile ? '8px 0' : '10px 0'}; font-size: ${mobile ? '0.85rem' : '0.9rem'}; color: #666;">
          Complete levels by reaching the required score and surviving the time limit!
        </p>
      </div>
    `,
    confirmButtonText: "Got it!",
    width: mobile ? "95vw" : "85vw",
    color: "orangered",
    background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    buttonsStyling: false,
    customClass: {
      confirmButton: "playAgain",
      title: "swal-title",
    },
  });
}
window.addEventListener("load", () => {
  gameIntro.play().catch((error) => {});
  document.body.addEventListener("click", () => {
    gameIntro.play().catch((error) => {});
  });
});
playButton.onclick = function (event) {
    const difficultySelect = document.querySelector('select[name="choose"]');
    if (difficultySelect.value === "Choose Game Mode") {
      const mobile = window.innerWidth < 768;
      Swal.fire({
        title: "⚠️ Difficulty Required",
        text: "Please select a difficulty level!",
        icon: "warning",
        confirmButtonText: "OK",
        width: mobile ? "95vw" : "85vw",
        color: "orangered",
        background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
        buttonsStyling: false,
        customClass: {
          confirmButton: "playAgain",
          title: "swal-title",
        },
      });
      return;
    }
    user.difficulty = difficultySelect.value;
  if (!userNameTextBox.value) {
    errorUserName.style.display = "inline";
  } else {
    errorUserName.style.display = "none";
    startPage.style.display = "none";
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name === userNameTextBox.value) {
      // Returning user logic
      user.name = storedUser.name;
      user.score = storedUser.score || 0;
      user.currentLevel = storedUser.currentLevel || 1;
      user.highestLevel = storedUser.highestLevel || 1;
      welcome.innerHTML = `Welcome back, ${user.name}`;
      userLastScore.innerText = `Your Last Score Was: ${user.score}`;
      if (levelProgressInfo) {
        levelProgressInfo.innerHTML = `Highest Level: ${user.highestLevel} | Current Level: ${user.currentLevel}`;
      }
    } else {
      // New user logic
      user.name = userNameTextBox.value;
      user.score = 0;
      user.currentLevel = 1;
      user.highestLevel = 1;
      localStorage.setItem("user", JSON.stringify(user));
      welcome.innerHTML = `Welcome, ${user.name}`;
      if (levelProgressInfo) {
        levelProgressInfo.innerHTML = `Start your journey at Level 1!`;
      }
    }
    welcomeDiv.style.display = "flex";
  }
};
startButton.onclick = function () {
  gameIntro.pause();
  location.href = "game-page.html";
};
// Tutorial button
if (tutorialBtn) {
  tutorialBtn.onclick = function () {
    showTutorial();
  };
}

howToPlayButton.onclick = function () {
  const mobile = window.innerWidth < 768;
  Swal.fire({
    title: "How to Play! 🐵🎮",
    html: `
            <div style="display: flex;text-align: start; flex-wrap: wrap; gap: ${mobile ? '10px' : '15px'}; font-size: ${mobile ? '0.9rem' : '1rem'};">
                <div style="flex: 1 1 400px; padding: ${mobile ? '10px' : '15px'}; background: rgba(177, 195, 99, 0.76); border-radius: 10px; border: 2px solid rgba(178, 195, 99, 0.5);">
                    <p style="margin: 0 0 ${mobile ? '8px' : '10px'} 0; font-weight: bold; font-size: ${mobile ? '1rem' : '1.1rem'};">🕹️ Movement</p>
                    ${mobile ? 
                      `<p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Use the <strong>⬅️ Left</strong> and <strong>➡️ Right</strong> buttons at the bottom of the screen</p>
                       <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Or swipe left/right on the screen to move</p>` :
                      `<p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">⬅️ <strong>Arrow Left</strong> - Move Left</p>
                       <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">➡️ <strong>Arrow Right</strong> - Move Right</p>`
                    }
                </div>
                <div style="flex: 1 1 400px; padding: ${mobile ? '10px' : '15px'}; background: rgba(177, 195, 99, 0.76); border-radius: 10px; border: 2px solid rgba(178, 195, 99, 0.5);">
                    <p style="margin: 0 0 ${mobile ? '8px' : '10px'} 0; font-weight: bold; font-size: ${mobile ? '1rem' : '1.1rem'};">🎯 Shooting</p>
                    ${mobile ? 
                      `<p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Tap the <strong>🔴 Shoot</strong> button at the bottom center</p>
                       <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Or tap anywhere in the bottom area of the game</p>` :
                      `<p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Press <strong>Space</strong> to shoot!</p>`
                    }
                </div>
                <div style="flex: 1 1 400px; padding: ${mobile ? '10px' : '15px'}; background: rgba(177, 195, 99, 0.76); border-radius: 10px; border: 2px solid rgba(178, 195, 99, 0.5);">
                    <p style="margin: 0 0 ${mobile ? '8px' : '10px'} 0; font-weight: bold; font-size: ${mobile ? '1rem' : '1.1rem'};">⏸️ Pause</p>
                    <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">${mobile ? 'Tap the <strong>⏸️ Pause</strong> button at the top left' : 'Press <strong>P</strong> or <strong>ESC</strong> to pause'}</p>
                </div>
                <div style="flex: 1 1 400px; padding: ${mobile ? '10px' : '15px'}; background: rgba(177, 195, 99, 0.76); border-radius: 10px; border: 2px solid rgba(178, 195, 99, 0.5);">
                    <p style="margin: 0 0 ${mobile ? '8px' : '10px'} 0; font-weight: bold; font-size: ${mobile ? '1rem' : '1.1rem'};">🎮 Levels</p>
                    <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Complete score and time requirements to advance!</p>
                </div>
                <div style="flex: 1 1 400px; padding: ${mobile ? '10px' : '15px'}; background: rgba(177, 195, 99, 0.76); border-radius: 10px; border: 2px solid rgba(178, 195, 99, 0.5);">
                    <p style="margin: 0 0 ${mobile ? '8px' : '10px'} 0; font-weight: bold; font-size: ${mobile ? '1rem' : '1.1rem'};">💎 Power-ups</p>
                    <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Collect special glowing fruits for temporary boosts!</p>
                </div>
                <div style="flex: 1 1 400px; padding: ${mobile ? '10px' : '15px'}; background: rgba(177, 195, 99, 0.76); border-radius: 10px; border: 2px solid rgba(178, 195, 99, 0.5);">
                    <p style="margin: 0 0 ${mobile ? '8px' : '10px'} 0; font-weight: bold; font-size: ${mobile ? '1rem' : '1.1rem'};">❤️ Lives</p>
                    <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">You start with 3 lives per level. Avoid letting fruits hit you!</p>
                </div>
                <div style="flex: 1 1 400px; padding: ${mobile ? '10px' : '15px'}; background: rgba(177, 195, 99, 0.76); border-radius: 10px; border: 2px solid rgba(178, 195, 99, 0.5);">
                    <p style="margin: 0 0 ${mobile ? '8px' : '10px'} 0; font-weight: bold; font-size: ${mobile ? '1rem' : '1.1rem'};">🔥 Combo</p>
                    <p style="margin: ${mobile ? '5px 0' : '8px 0'}; line-height: 1.5;">Hit fruits consecutively to build combos and multiply your score!</p>
                </div>
            </div>
        `,
    width: mobile ? "95vw" : "90vw",
    color: "orangered",
    background:
      "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    buttonsStyling: false,
    customClass: {
      confirmButton: "playAgain",
      title: "swal-title",
      popup: "custom-popup",
    },
  });
};

// Leaderboard
if (leaderboardBtn) {
  leaderboardBtn.onclick = function () {
    leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
    if (leaderboard.length === 0) {
      Swal.fire({
        title: "Leaderboard",
        text: "No scores yet! Be the first to set a record!",
        icon: "info",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "playAgain",
          title: "swal-title",
        },
      });
      return;
    }
    
    const mobile = window.innerWidth < 768;
    let currentFilter = 'all';
    
    function getFilteredLeaderboard(filter) {
      const now = Date.now();
      const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
      const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
      
      let filtered = [...leaderboard];
      
      if (filter === 'week') {
        filtered = filtered.filter(entry => entry.date >= weekAgo);
      } else if (filter === 'month') {
        filtered = filtered.filter(entry => entry.date >= monthAgo);
      }
      
      return filtered.slice(0, 10);
    }
    
    function renderLeaderboard(filter) {
      const filtered = getFilteredLeaderboard(filter);
      let leaderboardHTML = '<div style="text-align: center;">';
      leaderboardHTML += '<div style="margin-bottom: 15px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">';
      leaderboardHTML += `<button id="filter-all" class="filter-btn" style="padding: 8px 15px; border: 2px solid #B2C363; background: ${filter === 'all' ? '#B2C363' : 'transparent'}; color: white; border-radius: 5px; cursor: pointer;">All Time</button>`;
      leaderboardHTML += `<button id="filter-month" class="filter-btn" style="padding: 8px 15px; border: 2px solid #B2C363; background: ${filter === 'month' ? '#B2C363' : 'transparent'}; color: white; border-radius: 5px; cursor: pointer;">This Month</button>`;
      leaderboardHTML += `<button id="filter-week" class="filter-btn" style="padding: 8px 15px; border: 2px solid #B2C363; background: ${filter === 'week' ? '#B2C363' : 'transparent'}; color: white; border-radius: 5px; cursor: pointer;">This Week</button>`;
      leaderboardHTML += '</div>';
      leaderboardHTML += '<div style="max-height: 60vh; overflow-y: auto;">';
      leaderboardHTML += '<table style="width: 100%; border-collapse: collapse; margin: 0 auto;">';
      leaderboardHTML += '<tr style="background: rgba(178, 195, 99, 0.3);"><th style="padding: 10px;">Rank</th><th style="padding: 10px;">Name</th><th style="padding: 10px;">Level</th><th style="padding: 10px;">Score</th><th style="padding: 10px;">Date</th></tr>';
      
      if (filtered.length === 0) {
        leaderboardHTML += '<tr><td colspan="5" style="padding: 20px; text-align: center;">No scores for this period</td></tr>';
      } else {
        filtered.forEach((entry, index) => {
          const date = new Date(entry.date);
          const dateStr = date.toLocaleDateString();
          leaderboardHTML += `<tr style="border-bottom: 1px solid rgba(178, 195, 99, 0.3);">
            <td style="padding: 8px;">${index + 1}</td>
            <td style="padding: 8px;">${entry.name}</td>
            <td style="padding: 8px;">${entry.level}</td>
            <td style="padding: 8px;">${entry.score}</td>
            <td style="padding: 8px; font-size: 0.9em;">${dateStr}</td>
          </tr>`;
        });
      }
      
      leaderboardHTML += '</table></div></div>';
      return leaderboardHTML;
    }
    
    Swal.fire({
      title: "🏆 Leaderboard",
      html: renderLeaderboard('all'),
      width: mobile ? "95vw" : "85vw",
      color: "orangered",
      background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
      buttonsStyling: false,
      customClass: {
        confirmButton: "playAgain",
        title: "swal-title",
      },
      didOpen: () => {
        // Use event delegation on the Swal container
        const container = Swal.getHtmlContainer();
        if (container) {
          container.addEventListener('click', (e) => {
            const target = e.target;
            if (target.id === 'filter-all') {
              container.innerHTML = renderLeaderboard('all');
              currentFilter = 'all';
            } else if (target.id === 'filter-month') {
              container.innerHTML = renderLeaderboard('month');
              currentFilter = 'month';
            } else if (target.id === 'filter-week') {
              container.innerHTML = renderLeaderboard('week');
              currentFilter = 'week';
            }
          });
        }
      }
    });
  };
}

// Achievements
if (achievementsBtn) {
  achievementsBtn.onclick = function () {
    achievements = JSON.parse(localStorage.getItem("achievements")) || [];
    
    const achievementList = [
      { id: 'firstBanana', name: 'First Banana', desc: 'Hit your first banana', icon: '🍌' },
      { id: 'comboMaster', name: 'Combo Master', desc: 'Reach 20x combo', icon: '🔥' },
      { id: 'bombExpert', name: 'Bomb Expert', desc: 'Destroy 50 bombs', icon: '💣' },
      { id: 'level10', name: 'Level 10', desc: 'Complete level 10', icon: '🎯' },
      { id: 'perfectLevel', name: 'Perfect Level', desc: 'Complete level without losing a life', icon: '⭐' },
      { id: 'speedDemon', name: 'Speed Demon', desc: 'Complete level in under 30 seconds', icon: '⚡' },
      { id: 'score100', name: 'Centurion', desc: 'Reach 100 points', icon: '💯' },
      { id: 'score500', name: 'Half Grand', desc: 'Reach 500 points', icon: '🎖️' },
      { id: 'score1000', name: 'Grand Master', desc: 'Reach 1000 points', icon: '👑' },
      { id: 'score5000', name: 'Legend', desc: 'Reach 5000 points', icon: '🏆' }
    ];
    
    let achievementsHTML = '<div style="text-align: center; max-height: 60vh; overflow-y: auto;">';
    achievementsHTML += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; padding: 10px;">';
    
    achievementList.forEach(achievement => {
      const unlocked = achievements.find(a => a.id === achievement.id);
      achievementsHTML += `
        <div style="padding: 15px; border: 2px solid ${unlocked ? '#B2C363' : '#666'}; 
                    border-radius: 10px; background: ${unlocked ? 'rgba(177, 195, 99, 0.76)' : 'rgba(168, 164, 164, 0.38)'};">
          <div style="font-size: 2em;">${achievement.icon}</div>
          <div style="font-weight: bold; margin: 5px 0;">${achievement.name}</div>
          <div style="font-size: 0.9em; opacity: 0.8;">${achievement.desc}</div>
          ${unlocked ? '<div style="color: green; margin-top: 5px;">✓ Unlocked</div>' : '<div style="color: gray; margin-top: 5px;">🔒 Locked</div>'}
        </div>
      `;
    });
    
    achievementsHTML += '</div></div>';
    
    const mobile = window.innerWidth < 768;
    Swal.fire({
      title: "⭐ Achievements",
      html: achievementsHTML,
      width: mobile ? "95vw" : "90vw",
      color: "orangered",
      background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
      buttonsStyling: false,
      customClass: {
        confirmButton: "playAgain",
        title: "swal-title",
      },
    });
  };
}

// Settings
if (settingsMenuBtn) {
  settingsMenuBtn.onclick = function () {
    const mobile = window.innerWidth < 768;
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
        localStorage.setItem("settings", JSON.stringify(settings));
        
        if (gameIntro) {
          gameIntro.volume = settings.musicVolume;
          if (!settings.musicEnabled) {
            gameIntro.pause();
          }
        }
      }
    });
  };
}
