const userNameTextBox = document.querySelector("#userName");
const playButton = document.querySelector("#playButton");
const errorUserName = document.querySelector("#errorUserName");
const startPage = document.querySelector("div.startPage");
const welcomeDiv = document.querySelector("div.welcomeDiv");
const welcome = document.querySelector("#welcome");
const startButton = document.querySelector("#startButton");
const howToPlayButton = document.querySelector("#howtoplay");
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

// Combined Guide and Tutorial function
function showGuideAndTutorial() {
  const mobile = window.innerWidth < 768;
  
  // Responsive styling variables
  const titleFontSize = mobile ? '1rem' : '1.5rem';
  const goalMargin = mobile ? '6px 0' : '12px 0';
  const goalFontSize = mobile ? '0.8rem' : '1rem';
  const sectionGap = mobile ? '8px' : '15px';
  const sectionMarginTop = mobile ? '8px' : '18px';
  const cardPadding = mobile ? '8px' : '15px';
  const cardBorderRadius = mobile ? '6px' : '10px';
  const cardBorder = mobile ? '1.5px' : '2px';
  const cardGap = mobile ? '8px' : '12px';
  const cardTitleFontSize = mobile ? '0.85rem' : '1.1rem';
  const cardTitleMargin = mobile ? '0 0 6px 0' : '0 0 10px 0';
  const cardTextFontSize = mobile ? '0.75rem' : '0.95rem';
  const cardTextMargin = mobile ? '3px 0' : '6px 0';
  const cardLineHeight = mobile ? '1.4' : '1.5';
  const tipsMarginTop = mobile ? '10px' : '20px';
  const tipsPadding = mobile ? '8px 10px' : '15px 20px';
  const tipsTitleFontSize = mobile ? '0.85rem' : '1.1rem';
  const tipsTitleMargin = mobile ? '4px 0' : '8px 0';
  const tipsListFontSize = mobile ? '0.7rem' : '0.95rem';
  const tipsListPadding = mobile ? '0 0 0 20px' : '0 0 0 30px';
  const tipsListItemMargin = mobile ? '2px 0' : '4px 0';
  const tipsListLineHeight = mobile ? '1.4' : '1.6';
  const footerMargin = mobile ? '10px 0 0 0' : '18px 0 0 0';
  const footerFontSize = mobile ? '0.7rem' : '0.9rem';
  
  Swal.fire({
    title: `<span style="font-size: ${titleFontSize};">Welcome to Monkey Game! 🐵🎮</span>`,
    html: `
      <div style="text-align: center;">
        <p style="margin: ${goalMargin}; font-size: ${goalFontSize}; font-weight: 600;">
          <strong>Goal:</strong> ${mobile ? 'Shoot bananas to score and complete levels!' : 'Shoot falling bananas and fruits to score points. Complete each level by reaching the required score to advance!'}
        </p>
        
        <div style="display: flex; text-align: start; flex-wrap: wrap; gap: ${cardGap}; font-size: ${cardTextFontSize}; margin-top: ${sectionMarginTop};">
            <div style="flex: 1 1 ${mobile ? '100%' : '280px'}; padding: ${cardPadding}; background: rgba(177, 195, 99, 0.76); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
                <p style="margin: ${cardTitleMargin}; font-weight: bold; font-size: ${cardTitleFontSize};">🕹️ ${mobile ? 'Movement Controls' : 'Movement'}</p>
                ${mobile ? 
                  `<p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                    Use the <strong>⬅️ Left</strong> and <strong>➡️ Right</strong> buttons at the bottom of the screen to move your monkey.<br/>
                    <span style="font-size: 0.9em; color: #555;">Alternatively, swipe left or right anywhere on the screen to move.</span>
                  </p>` :
                  `<p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                    Use your keyboard arrow keys to move the monkey:<br/>
                    ⬅️ <strong>Arrow Left</strong> - Move Left<br/>
                    ➡️ <strong>Arrow Right</strong> - Move Right<br/>
                    <span style="font-size: 0.9em; color: #555;">Hold the key to move continuously.</span>
                  </p>`
                }
            </div>
            <div style="flex: 1 1 ${mobile ? '100%' : '280px'}; padding: ${cardPadding}; background: rgba(177, 195, 99, 0.76); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
                <p style="margin: ${cardTitleMargin}; font-weight: bold; font-size: ${cardTitleFontSize};">🎯 Shooting</p>
                ${mobile ? 
                  `<p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                    Tap the <strong>🔴 Shoot</strong> button at the bottom center to fire coconuts upward.<br/>
                    <span style="font-size: 0.9em; color: #555;">You can also tap anywhere in the bottom area of the game screen to shoot.</span>
                  </p>` :
                  `<p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                    Press the <strong>Space</strong> key to shoot coconuts upward at falling fruits.<br/>
                    <span style="font-size: 0.9em; color: #555;">Rapidly press Space for faster shooting, or hold it down for continuous fire.</span>
                  </p>`
                }
            </div>
            <div style="flex: 1 1 ${mobile ? '100%' : '280px'}; padding: ${cardPadding}; background: rgba(177, 195, 99, 0.76); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
                <p style="margin: ${cardTitleMargin}; font-weight: bold; font-size: ${cardTitleFontSize};">⏸️ Pause</p>
                <p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                  ${mobile ? 
                    'Tap the <strong>⏸️ Pause</strong> button at the top left corner to pause the game at any time.' :
                    'Press <strong>P</strong> or <strong>ESC</strong> key to pause the game. Press again to resume.'
                  }
                </p>
            </div>
            <div style="flex: 1 1 ${mobile ? '100%' : '280px'}; padding: ${cardPadding}; background: rgba(177, 195, 99, 0.76); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
                <p style="margin: ${cardTitleMargin}; font-weight: bold; font-size: ${cardTitleFontSize};">🎮 Levels</p>
                <p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                  ${mobile ? 
                    'Reach the required <strong>score</strong> shown at the top to complete the level and advance!' :
                    'Each level has a score requirement displayed at the top. Reach the target score to complete the level and unlock the next one. Difficulty increases with each level!'
                  }
                </p>
            </div>
            <div style="flex: 1 1 ${mobile ? '100%' : '280px'}; padding: ${cardPadding}; background: rgba(177, 195, 99, 0.76); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
                <p style="margin: ${cardTitleMargin}; font-weight: bold; font-size: ${cardTitleFontSize};">💎 Power-ups</p>
                <p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                  ${mobile ? 
                    'Shoot glowing golden fruits to collect power-ups! They give temporary boosts like multi-shot, rapid fire, shield, magnet, and more.' :
                    'Shoot special glowing golden fruits to activate power-ups! Available power-ups include: <strong>Multi Shot</strong> (shoot 3 at once), <strong>Rapid Fire</strong> (faster shooting), <strong>Slow Motion</strong> (slower fruits), <strong>Score x2</strong> (double points), <strong>Shield</strong> (protection), <strong>Magnet</strong> (attracts fruits), and <strong>Extra Life</strong> (+1 life).'
                  }
                </p>
            </div>
            <div style="flex: 1 1 ${mobile ? '100%' : '280px'}; padding: ${cardPadding}; background: rgba(177, 195, 99, 0.76); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
                <p style="margin: ${cardTitleMargin}; font-weight: bold; font-size: ${cardTitleFontSize};">❤️ Lives</p>
                <p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                  ${mobile ? 
                    'You start with <strong>3 lives</strong> per level. If a fruit touches the monkey, you lose a life. Game over when all lives are lost!' :
                    'You start with <strong>3 lives</strong> per level. If any fruit (except bombs) touches the monkey, you lose one life. Poison fruits take 2 lives! When all lives are lost, the game ends. Collect Extra Life power-ups to gain additional lives.'
                  }
                </p>
            </div>
            <div style="flex: 1 1 ${mobile ? '100%' : '280px'}; padding: ${cardPadding}; background: rgba(177, 195, 99, 0.76); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
                <p style="margin: ${cardTitleMargin}; font-weight: bold; font-size: ${cardTitleFontSize};">🔥 Combo System</p>
                <p style="margin: ${cardTextMargin}; line-height: ${cardLineHeight}; font-size: ${cardTextFontSize};">
                  ${mobile ? 
                    'Hit fruits consecutively without missing to build combos! Higher combos = more points!' :
                    'Hit fruits consecutively without missing to build combo multipliers! The combo counter increases with each hit and resets if you miss. Higher combos multiply your score, so keep the streak going for maximum points!'
                  }
                </p>
            </div>
        </div>
        
        <div style="margin: ${tipsMarginTop} auto 0; padding: ${tipsPadding}; background: rgba(177, 195, 99, 0.5); border-radius: ${cardBorderRadius}; border: ${cardBorder} solid rgba(178, 195, 99, 0.5);">
            <p style="margin: ${tipsTitleMargin}; font-weight: bold; font-size: ${tipsTitleFontSize};">💡 ${mobile ? 'Scoring Guide' : 'Detailed Scoring & Tips'}:</p>
            <ul style="margin: ${tipsTitleMargin}; padding: ${tipsListPadding}; font-size: ${tipsListFontSize}; line-height: ${tipsListLineHeight}; text-align: left;">
                ${mobile ? 
                  `<li style="margin: ${tipsListItemMargin};">🍌 <strong>Bananas</strong> = 1 point each</li>
                  <li style="margin: ${tipsListItemMargin};">⭐ <strong>Golden fruits</strong> = 2 points each</li>
                  <li style="margin: ${tipsListItemMargin};">💣 <strong>Bombs</strong> explode and clear nearby fruits</li>
                  <li style="margin: ${tipsListItemMargin};">🔥 <strong>Combos</strong> multiply your score</li>
                  <li style="margin: ${tipsListItemMargin};">💎 <strong>Power-ups</strong> give special abilities</li>
                  <li style="margin: ${tipsListItemMargin};">⚠️ <strong>Poison fruits</strong> take 2 lives!</li>
                  <li style="margin: ${tipsListItemMargin};">🎁 <strong>Bonus fruits</strong> give extra points</li>` :
                  `<li style="margin: ${tipsListItemMargin};">🍌 <strong>Bananas</strong> = 1 point each. These are the most common fruits.</li>
                  <li style="margin: ${tipsListItemMargin};">⭐ <strong>Golden fruits</strong> = 2 points each. Worth more, so prioritize them!</li>
                  <li style="margin: ${tipsListItemMargin};">💣 <strong>Bombs</strong> explode and clear all nearby fruits in a radius. Use them strategically to clear multiple fruits at once.</li>
                  <li style="margin: ${tipsListItemMargin};">🔥 <strong>Combos</strong> multiply your score. Hit fruits consecutively to build up multipliers for massive points!</li>
                  <li style="margin: ${tipsListItemMargin};">💎 <strong>Power-ups</strong> appear as glowing golden fruits. Shoot them to activate special abilities that last for a limited time.</li>
                  <li style="margin: ${tipsListItemMargin};">⚠️ <strong>Poison fruits</strong> (purple bombs) are dangerous! They take 2 lives if they hit you. If you have no lives left and shoot one, you lose 2 points.</li>
                  <li style="margin: ${tipsListItemMargin};">🎁 <strong>Bonus fruits</strong> give extra points when collected. Look out for special colored fruits!</li>
                  <li style="margin: ${tipsListItemMargin};">💡 <strong>Pro Tip:</strong> Use the Magnet power-up to automatically collect fruits, and combine it with Score x2 for maximum points!</li>`
                }
            </ul>
        </div>
        
        <p style="margin: ${footerMargin}; font-size: ${footerFontSize}; color: #666; font-weight: 500;">
          ${mobile ? 'Complete levels by reaching the required score!' : 'Complete each level by reaching the required score. Good luck and have fun! 🎮'}
        </p>
      </div>
    `,
    confirmButtonText: "Got it!",
    width: mobile ? "95vw" : "90vw",
    color: "orangered",
    background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
    buttonsStyling: false,
    customClass: {
      confirmButton: "playAgain",
      title: "swal-title",
      popup: "custom-popup",
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
// Guide & Tutorial button - shows merged guide and tutorial
howToPlayButton.onclick = function () {
  showGuideAndTutorial();
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
      
      // Responsive styling for leaderboard
      const filterMarginBottom = mobile ? '8px' : '15px';
      const filterGap = mobile ? '5px' : '10px';
      const filterPadding = mobile ? '5px 10px' : '8px 15px';
      const filterFontSize = mobile ? '0.7rem' : '0.9rem';
      const filterBorderWidth = mobile ? '1.5px' : '2px';
      const filterBorderRadius = mobile ? '4px' : '5px';
      const tableMaxHeight = mobile ? '50vh' : '60vh';
      const headerPadding = mobile ? '6px 4px' : '10px';
      const headerFontSize = mobile ? '0.75rem' : '1rem';
      const cellPadding = mobile ? '5px 3px' : '8px';
      const cellFontSize = mobile ? '0.7rem' : '0.9rem';
      const dateFontSize = mobile ? '0.65em' : '0.9em';
      const emptyCellPadding = mobile ? '12px' : '20px';
      const emptyCellFontSize = mobile ? '0.75rem' : '1rem';
      
      let leaderboardHTML = '<div style="text-align: center;">';
      leaderboardHTML += `<div style="margin-bottom: ${filterMarginBottom}; display: flex; gap: ${filterGap}; justify-content: center; flex-wrap: wrap;">`;
      leaderboardHTML += `<button id="filter-all" class="filter-btn" style="padding: ${filterPadding}; border: ${filterBorderWidth} solid #B2C363; background: ${filter === 'all' ? '#B2C363' : 'transparent'}; color: white; border-radius: ${filterBorderRadius}; cursor: pointer; font-size: ${filterFontSize};">All Time</button>`;
      leaderboardHTML += `<button id="filter-month" class="filter-btn" style="padding: ${filterPadding}; border: ${filterBorderWidth} solid #B2C363; background: ${filter === 'month' ? '#B2C363' : 'transparent'}; color: white; border-radius: ${filterBorderRadius}; cursor: pointer; font-size: ${filterFontSize};">This Month</button>`;
      leaderboardHTML += `<button id="filter-week" class="filter-btn" style="padding: ${filterPadding}; border: ${filterBorderWidth} solid #B2C363; background: ${filter === 'week' ? '#B2C363' : 'transparent'}; color: white; border-radius: ${filterBorderRadius}; cursor: pointer; font-size: ${filterFontSize};">This Week</button>`;
      leaderboardHTML += '</div>';
      leaderboardHTML += `<div style="max-height: ${tableMaxHeight}; overflow-y: auto;">`;
      leaderboardHTML += '<table style="width: 100%; border-collapse: collapse; margin: 0 auto; font-size: ' + (mobile ? '0.8rem' : '1rem') + ';">';
      leaderboardHTML += `<tr style="background: rgba(178, 195, 99, 0.3);"><th style="padding: ${headerPadding}; font-size: ${headerFontSize};">Rank</th><th style="padding: ${headerPadding}; font-size: ${headerFontSize};">Name</th><th style="padding: ${headerPadding}; font-size: ${headerFontSize};">Level</th><th style="padding: ${headerPadding}; font-size: ${headerFontSize};">Score</th><th style="padding: ${headerPadding}; font-size: ${headerFontSize};">Date</th></tr>`;
      
      if (filtered.length === 0) {
        leaderboardHTML += `<tr><td colspan="5" style="padding: ${emptyCellPadding}; text-align: center; font-size: ${emptyCellFontSize};">No scores for this period</td></tr>`;
      } else {
        filtered.forEach((entry, index) => {
          const date = new Date(entry.date);
          // Shorter date format on mobile
          const dateStr = mobile ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : date.toLocaleDateString();
          leaderboardHTML += `<tr style="border-bottom: 1px solid rgba(178, 195, 99, 0.3);">
            <td style="padding: ${cellPadding}; font-size: ${cellFontSize};">${index + 1}</td>
            <td style="padding: ${cellPadding}; font-size: ${cellFontSize};">${entry.name}</td>
            <td style="padding: ${cellPadding}; font-size: ${cellFontSize};">${entry.level}</td>
            <td style="padding: ${cellPadding}; font-size: ${cellFontSize};">${entry.score}</td>
            <td style="padding: ${cellPadding}; font-size: ${dateFontSize};">${dateStr}</td>
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
    
    const mobile = window.innerWidth < 768;
    
    // Responsive styling for achievements
    const gridMinWidth = mobile ? '100px' : '200px';
    const gridGap = mobile ? '8px' : '15px';
    const gridPadding = mobile ? '5px' : '10px';
    const cardPadding = mobile ? '8px' : '15px';
    const iconSize = mobile ? '1.5em' : '2em';
    const nameFontSize = mobile ? '0.85rem' : '1rem';
    const descFontSize = mobile ? '0.75em' : '0.9em';
    const nameMargin = mobile ? '3px 0' : '5px 0';
    const statusMargin = mobile ? '3px 0 0 0' : '5px 0 0 0';
    const borderRadius = mobile ? '6px' : '10px';
    const borderWidth = mobile ? '1.5px' : '2px';
    
    let achievementsHTML = `<div style="text-align: center; max-height: ${mobile ? '50vh' : '60vh'}; overflow-y: auto;">`;
    achievementsHTML += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${gridMinWidth}, 1fr)); gap: ${gridGap}; padding: ${gridPadding};">`;
    
    achievementList.forEach(achievement => {
      const unlocked = achievements.find(a => a.id === achievement.id);
      achievementsHTML += `
        <div style="padding: ${cardPadding}; border: ${borderWidth} solid ${unlocked ? '#B2C363' : '#666'}; 
                    border-radius: ${borderRadius}; background: ${unlocked ? 'rgba(177, 195, 99, 0.76)' : 'rgba(168, 164, 164, 0.38)'};">
          <div style="font-size: ${iconSize};">${achievement.icon}</div>
          <div style="font-weight: bold; margin: ${nameMargin}; font-size: ${nameFontSize};">${achievement.name}</div>
          <div style="font-size: ${descFontSize}; opacity: 0.8;">${achievement.desc}</div>
          ${unlocked ? `<div style="color: green; margin-top: ${statusMargin}; font-size: ${mobile ? '0.7em' : '0.85em'};">✓ Unlocked</div>` : `<div style="color: gray; margin-top: ${statusMargin}; font-size: ${mobile ? '0.7em' : '0.85em'};">🔒 Locked</div>`}
        </div>
      `;
    });
    
    achievementsHTML += '</div></div>';
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
      width: mobile ? "95vw" : "60vw",
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
