const sounds = {
    gameTheme : document.getElementById('game_theme'),
    gameOverSound : document.getElementById('game_over'),
    gameWinSound : document.getElementById('game_win'),
    bomb : document.getElementById('bomb'),
    shotBomb : document.getElementById('shotBomb'),
    addScore : document.getElementById('add_score'),
    golden : document.getElementById('golden'),
}
const user ={
    name:"",
    score:"",
}
const sources = ["banana.png", "bomb.gif", "golden.png"];
const gameContainer = document.querySelector("div[class=gameContainer]");
const stopWatch = document.getElementById('stopwatch');
const scoreObject = document.getElementById('score');
const shootIndicator = document.getElementById("shootIndicator");
const userNameObject = document.getElementById('name');
let canShoot = true;
let imagesArray = [];
let gameInterval, stopWatchInterval;
let seconds = 0;
let minutes = 0;
let score = 0;
const monkey = createMonkey();

// Play The Main Sound Of Game
sounds.gameTheme.play().catch(error =>{});
document.body.addEventListener('click', () => {
    sounds.gameTheme.play().catch(error =>{});
});
// Rtrieve User
const savedUser = JSON.parse(localStorage.getItem('user'));
user.name = savedUser.name; 
user.score = savedUser.score;

// display username
userNameObject.innerHTML = ` ${user.name}`;

// Create Monkey 
function createMonkey() {
    const monkey = document.createElement('img');
    monkey.src = "images/monkey.gif";
    monkey.className = "monkey";
    monkey.style.top = `${gameContainer.clientHeight - 80}px`; // 80 Is Monkey's Height
    monkey.style.left = `${(gameContainer.clientWidth / 2 - 80)}px`; // Center Horizontally
    gameContainer.append(monkey);
    return monkey;
}

// Move The Monkey
document.onkeydown = function (event) {
    let currentPosition = monkey.offsetLeft;
    if (event.key == "ArrowLeft" && currentPosition > 20) {
        currentPosition -= 40;
        monkey.style.left = currentPosition + 'px';
    } else if (event.key == "ArrowRight" && currentPosition < gameContainer.clientWidth - monkey.clientWidth - 20) {
        currentPosition += 40;
        monkey.style.left = currentPosition + 'px';
    } else if (event.key == " " && canShoot) {
        shootStone();
        canShoot = false;
        shootIndicator.style.backgroundColor = "red"; // Not ready to shoot
        setTimeout(() => {
            canShoot = true;
            shootIndicator.style.backgroundColor = "green"; // Ready to shoot
        }, 1000);
    };
}
// Create Fruit Object
const createFruitObject = function(src, leftPosition){
    const fruitObject = document.createElement('img');
    fruitObject.src = `images/${src}`;
    fruitObject.classList.add('banana');
    fruitObject.style.left = leftPosition + 'vw';
    return fruitObject;
}
// Move Created Fruit Downwards
const moveFruitDown = function(fruitObject){
    let topPosition = 0;
    const moveDownInterval = setInterval(function () {
        topPosition += 100;
        fruitObject.style.top = topPosition + 'px';
        if (fruitObject.offsetTop >= monkey.offsetTop - fruitObject.clientHeight + 15) {
            clearInterval(moveDownInterval);
            fruitObject.remove();
            gameOver();
            console.log('game over');
        }
    }, 5000);
}
// Creates Objects and Position It
const createMovingDownObjects = function (array) {
    const row = [];
    let leftPosition = 5;
    let shuffledSources = shuffleArray([...array, ...array, ...array]);
    //Creates One Moving Down Row
    for (let i = 0; i < 9; i++) {
        const fruitObject = createFruitObject(shuffledSources[i], leftPosition);
        leftPosition += 8;
        gameContainer.append(fruitObject);
        row.push(fruitObject);
        moveFruitDown(fruitObject);
    }
    imagesArray.push(row);
    console.log(imagesArray);
}

// Create Stone
function createStone(stonePosition) {
    const stone = document.createElement('img');
    stone.src = "images/stone.png";
    stone.classList.add('stone');
    stone.style.left = `${monkey.offsetLeft + monkey.clientWidth / 2 - 10}px`;
    stone.style.top = `${stonePosition}px`;
    return stone;
}
//Shoot Stone From The Monkey
const shootStone = function () {
    let stonePosition = monkey.offsetTop;
    const stone = createStone(stonePosition);
    sounds.shotBomb.play();
    gameContainer.append(stone);
    //moving stone upwards
    moveStoneUp(stone, stonePosition);
}
//Move Stone Up
const moveStoneUp = function(stone, stonePosition){
    const stoneInterval = setInterval(() => {
        if (stonePosition <= gameContainer.offsetTop-40) {
            clearInterval(stoneInterval);
            stone.remove();
        } else {
            stonePosition = stone.offsetTop;
            stonePosition -= 20;
            stone.style.top = `${stonePosition}px`;
            checkCollision(stone);
        }
    }, 10);
}
// Collision Detection
const checkCollision = function (stone) {
    // Helper Function
    const isOverlapping = (rect1, rect2) => (
        rect1.top <= rect2.bottom &&
        rect1.bottom >= rect2.top &&
        rect1.left <= rect2.right &&
        rect1.right >= rect2.left
    );
    const stoneRect = stone.getBoundingClientRect();
    imagesArray.forEach((row, i) => {
        row.forEach((fruit, j) => {
            if (fruit) {
                const fruitRect = fruit.getBoundingClientRect();
                if (isOverlapping(stoneRect, fruitRect)) {
                    stone.remove();
                    handleCollision(fruit, i, j);
                }
            }
        });
    });
};
// Handle Collision
const handleCollision = function (imgObj, i, j) {
    if (imgObj.src.includes("banana.png")) {
        imgObj.remove();
        imagesArray[i][j] = null;
        score += 1;
        trackScore(score);
        sounds.addScore.play();
        console.log("Banana collision! Score:", score);
    } else if (imgObj.src.includes("golden.png")) {
        imgObj.remove();
        imagesArray[i][j] = null;
        score += 2;
        trackScore(score);
        sounds.golden.play();
        console.log("Golden collision! Score:", score);
    } else if (imgObj.src.includes("bomb.gif")) {
        removeSurroundingFruits(i, j);
        sounds.bomb.play();
        console.log("Bomb collision! Score:", score);
    }
}

//********* Remove Objects Around The Bomb
const removeSurroundingFruits = function (i, j) {
    const indices = [
        [i + 1, j - 1], [i + 1, j], [i + 1, j + 1], // Top Row  (i+ Becuase The Reversed Array In DOM)
        [i, j - 1], [i, j], [i, j + 1],             // Current row
        [i - 1, j - 1], [i - 1, j], [i - 1, j + 1], // Bottom Row
    ];
    indices.forEach(([x, y]) => {
        if (x >= 0 && x < imagesArray.length && y >= 0 && y < imagesArray[x]?.length) {
            const fruit = imagesArray[x][y];
            if (fruit) {
                if (fruit.src.includes("banana.png")) score ++;
                if (fruit.src.includes("golden.png")) score += 2;
                trackScore(score);
                fruit.remove();
                if (imagesArray[x] === undefined || imagesArray[x][y] === undefined || !imagesArray[x][y]) return;
                else imagesArray[x][y] = null;
            }
        }
    });
};

// Track Score & Handle Winning Score
const trackScore = function (score) {
    scoreObject.innerText = `SCORE : ${score < 10 ? '0' + score : score}`;
    // if (score >= 20) gameWin();
};

// Game Winning
const gameWin = function () {
    stopAllIntervals();
    user.score = score;
    localStorage.setItem('user', JSON.stringify(user));
    sounds.gameWinSound.play();
    //Sweealert2 A popup Js Library 
    Swal.fire({
        title: `Awesome! 🎉\n${user.name}`,
        confirmButtonText: "Play Again!",
        text:`YOUR SCORE IS : ${score}`,
        confirmButtonColor: "darkgreen",
        imageUrl: "./images/monkey-win.gif",
        width: "60vw",
        color: "orangered",
        background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
        allowOutsideClick: false,
        buttonsStyling: false,
        showCancelButton:true,
        customClass: {
            confirmButton: 'playAgain',
            cancelButton: 'playAgain cancel',
            title: 'swal-title ',
            image: 'winImg',
        }
    }).then((result) => {
        if(result.isDismissed){
            location.replace("home-page.html");
        }else if(result.isConfirmed){
            resetGame();
        }
    });
};


// Game Over
const gameOver = function () {
    stopAllIntervals();
    user.score = score;
    localStorage.setItem('user', JSON.stringify(user)); 
    sounds.gameOverSound.play();
    //Sweealert2 A popup Js Library 
    Swal.fire({
        title: "Game Over",
        confirmButtonText: "Play Again !",
        imageUrl: "./images/sad.gif",
        width: '60vw',
        color: "orangered",
        background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
        allowOutsideClick: false,
        buttonsStyling: false,
        showCancelButton: true,
        customClass: {
            confirmButton: 'playAgain',
            cancelButton: 'playAgain cancel',
            title: 'swal-title ',
        }
    }).then((result) => {
        if(result.isDismissed){
            location.href = "home-page.html";
        }else if(result.isConfirmed){
            resetGame();
        }
    });
}

// Reset Game
const resetGame = function () {
    stopAllIntervals();
    score = 0;
    user.score = score;
    localStorage.setItem('user', JSON.stringify(user)); 
    seconds = 0;
    minutes = 0;
    trackScore(score);
    createMovingDownObjects(sources);
    startGame();
};

// Stop All Intervals
const stopAllIntervals = function () {
    const gameElements = gameContainer.querySelectorAll('img:not(.monkey)');
    gameElements.forEach(element => element.remove());
    imagesArray = [];
    clearInterval(gameInterval);
    clearInterval(stopWatchInterval);
};

// Control Stop Watch
const startStopWatch = function () {
    stopWatchInterval = setInterval(function () {
        seconds++;
        if (seconds === 60) { minutes++; seconds = 0; }
        if (minutes === 2) {
            gameWin();
        };
        stopWatch.innerText = `${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
};

// Game Intervals
const startGame = function () {
    gameInterval = setInterval(() => createMovingDownObjects(sources), 5000);
    startStopWatch();
};

//==============================
//         START GAME
//==============================
createMovingDownObjects(sources);
startGame();




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
window.onresize = function () {
    monkey.style.top = (gameContainer.clientHeight - 80) + 'px'; // 80 Is Monkey's Height
    monkey.style.left = (gameContainer.clientWidth / 2 - 80) + 'px'; // Center Monkey Horizontally
}
// ******** Fullscreen Mode
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
    const icon = fullscreenBtn.querySelector('i');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
    } else {
        document.exitFullscreen();
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
    }
    // Prevent Space (Event) From Exiting Fullscreen Mode
    document.addEventListener('keydown', (event) => {
        if (document.fullscreenElement && event.code === 'Space') {
            event.preventDefault();
        }
    });
});
// Display Mouse Position (For Debugging)
let xy = document.createElement('span');
gameContainer.append(xy);
gameContainer.onmousemove = function (e) {
    xy.innerText = `${e.x}x${e.y}`
}

// Handle playing on mobile 
let touchStartX = 0; // to track where the touch started for movement
let touchEndX = 0;   // to track where the touch ended for movement
let touchStartY = 0; // for shooting area touch detection

// Handle touch move for moving the monkey
document.addEventListener('touchstart', (event) => {
    // Store the starting touch position
    touchStartX = event.touches[0].clientX; 
    touchStartY = event.touches[0].clientY; // for detecting shooting area
}, { passive: true });

document.addEventListener('touchmove', (event) => {
    // Prevent default behavior to avoid screen scrolling
    event.preventDefault();
    
    // Get the current touch position
    touchEndX = event.touches[0].clientX;
    
    let currentPosition = monkey.offsetLeft;

    // Move monkey based on touch movement
    if (touchEndX < touchStartX && currentPosition > 20) { // swipe left
        currentPosition -= 40;
        monkey.style.left = currentPosition + 'px';
    } else if (touchEndX > touchStartX && currentPosition < gameContainer.clientWidth - monkey.clientWidth - 20) { // swipe right
        currentPosition += 40;
        monkey.style.left = currentPosition + 'px';
    }
}, { passive: true });

// Handle touch to shoot
document.addEventListener('touchend', (event) => {
    // Check if the touch ended in the shooting area (like bottom center of the screen)
    const shootArea = gameContainer.clientHeight - 100; // adjust based on where you want to shoot from
    if (event.changedTouches[0].clientY > shootArea && canShoot) {
        shootStone(); // shoot the stone
        canShoot = false;
        shootIndicator.style.backgroundColor = "red"; // Not ready to shoot
        setTimeout(() => {
            canShoot = true;
            shootIndicator.style.backgroundColor = "green"; // Ready to shoot
        }, 1000);
    }
}, { passive: true });
