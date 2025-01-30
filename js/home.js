const userNameTextBox = document.querySelector('#userName');
const playButton = document.querySelector('#playButton');
const errorUserName = document.querySelector('#errorUserName');
const startPage = document.querySelector("div.startPage");
const welcomeDiv = document.querySelector("div.welcomeDiv");
const welcome = document.querySelector("#welcome");
const startButton = document.querySelector("#startButton");
const howToPlayButton = document.querySelector("#howtoplay");
const gameIntro = document.getElementById('game_intro');
const userLastScore = document.getElementById('lastscore');
const user ={
    name:"",
    score:"",
}
window.addEventListener('load',() => {
    gameIntro.play().catch(error =>{});
    document.body.addEventListener('click', () => {
        gameIntro.play().catch(error =>{});
    });
});
playButton.onclick = function (event) {
    if (!userNameTextBox.value) {
        errorUserName.style.display = 'inline';
    } else {
        errorUserName.style.display = 'none';
        startPage.style.display = 'none';
        // Retrieve user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.name === userNameTextBox.value) {
            // Returning user logic
            user.name = storedUser.name;
            user.score = storedUser.score;
            welcome.innerHTML = `Welcome back, ${user.name}`;
            userLastScore.innerText = `Your Last Score Was: ${user.score}`;
        } else {
            // New user logic
            user.name = userNameTextBox.value;
            user.score = 0; // Default score for new users
            localStorage.setItem('user', JSON.stringify(user));
            welcome.innerHTML = `Welcome, ${user.name}`;
            userLastScore.innerText = `This is your first time playing.\n Good luck!`;
        }
        welcomeDiv.style.display = 'flex';
    }
}
startButton.onclick = function () {
    gameIntro.pause();
    location.href = "game-page.html";
}
howToPlayButton.onclick = function(){
    Swal.fire({
        title: "How to Play! 🐵🎮",
        html: `
            <div style="text-align: center;">
                <p><strong>🕹️ Movement</strong></p>
                <p>⬅️ Move Left | ➡️ Move Right </p>
                <p><strong>🎯 Shooting</strong></p>
                <p>Press <strong>Space</strong> to shoot!</p>    
            </div>
        `,
        width: '70vw',
        color: "orangered",
        background: "repeating-linear-gradient(45deg,#B2C363,#B2C363 10px,#F0E68C 10px, #F0E68C 20px)",
        buttonsStyling: false,
        customClass: {
            confirmButton: 'playAgain',
            title: 'swal-title',
            popup: 'custom-popup',
        }
    });
    
}