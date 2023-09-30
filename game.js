// Query Selectors
const rulesContainer = document.querySelector(".rules");
const boardSizeSelection = document.getElementById("board-size");
const playTimeSelection = document.getElementById("play-time");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const gameContainer = document.querySelector(".game-wrapper");
const boardContainer = document.querySelector(".game .board");
const numberOfMovesContainer = document.querySelector(".moves span");
const timerContainer = document.querySelector(".timer span");

// Globals
const flippedCards = [];
let playTime, boardSize;
let pokemons = [];
let clickedCards = [];
let numberOfMoves = 0;
let timer;

// Event Listeners
startBtn.addEventListener("click", initGame);
boardContainer.addEventListener("click", playGame);
restartBtn.addEventListener("click", ()=> location.reload());

async function initGame() {
  const { options: sizeOptions } = boardSizeSelection;
  const { options: timeOptions } = playTimeSelection;
  // initialize playTime and board Size
  boardSize = parseInt(sizeOptions[sizeOptions.selectedIndex].value);
  playTime = parseInt(timeOptions[timeOptions.selectedIndex].value);

  // Generate Random pokemon image based on board size
  pokemons = await generatePokemons(boardSize);

  // Set Timer
  setTimer();

  // Start Game
  startGame();
}

async function generatePokemons(size) {
  const cards = [];

  while (cards.length < size) {
    let random = Math.floor(Math.random() * 147) + 1;
    if (!cards.includes(`${random}.png`)) {
      // push card twice
      cards.push(`${random}.png`);
      cards.push(`${random}.png`);
    }
  }
  return cards.sort(() => 0.5 - Math.random());
}

function startGame() {
  // Hide Rules
  rulesContainer.style.display = "none";

  // Show game
  gameContainer.style.display = "block";

  // Create Cards
  createCards();

  // Play start game sound
  playSound("start-game");
}

function createCards() {
  for (let pokemon of pokemons) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.pokemon = pokemon;
    const front = document.createElement("div");
    front.className = "front";
    front.innerHTML = "?";
    const back = document.createElement("div");
    back.className = "back";

    const image = document.createElement("img");
    image.setAttribute("src", `./images/${pokemon}`);

    // Append
    back.appendChild(image);

    card.appendChild(front);
    card.appendChild(back);

    boardContainer.appendChild(card);
  }
}

function playGame(e) {
  const clickedCard = e.target;
  if (clickedCard.className === "front") {
    const card = clickedCard.parentNode;
    // Show card
    card.classList.add("flip");

    // push to clickedCards
    clickedCards.push(card);

    // Click Sound
    playSound("click");

    // Increase Number of moves
    numberOfMoves++;

    // Show number of moves
    numberOfMovesContainer.innerHTML = Math.floor(numberOfMoves / 2);

    if (clickedCards.length === 2) {
      // Block click event
      boardContainer.classList.add("block-click");
      const [card1, card2] = clickedCards;
      if (card1.dataset.pokemon !== card2.dataset.pokemon) {
        setTimeout(() => {
          card1.classList.remove("flip");
          card2.classList.remove("flip");
        }, 800);
      } else {
        // push to fliped cards
        flippedCards.push(card1);
        flippedCards.push(card2);

        if (flippedCards.length === pokemons.length) {
          setTimeout(() => {
            playerWon();
          }, 500);
        }
      }

      // Clear Clicked Cards
      clickedCards = [];
      // Allow click event
      setTimeout(() => {
        boardContainer.classList.remove("block-click");
      }, 800);
    }
  }
}


function playSound(fileName) {
  const audio = new Audio(`./sounds/${fileName}.mp3`);
  audio.play();
}

function gameOver() {
  // change timer to red
  timerContainer.style.color = "var(--red-color)";
  // play end of the game sound
  playSound("end-game");

  // add effects to the board container
  boardContainer.classList.add("block-click");
  boardContainer.style.backgroundColor = "var(--red-color)";
  restartBtn.style.display = "block";
}

function playerWon() {
  // clear timer
  clearInterval(timer);
  // play end of the game sound
  playSound("player-won");

  // add effects to the board container
  boardContainer.classList.add("block-click");
  boardContainer.style.backgroundColor = "#1B9C85";
  restartBtn.style.display = "block";
}

function setTimer() {
  timer = setInterval(() => {
    let minutes = Math.floor(playTime / 60);
    let seconds = Math.floor(playTime % 60);

    minutes = minutes > 9 ? minutes : `0${minutes}`;
    seconds = seconds > 9 ? seconds : `0${seconds}`;

    // Show time
    timerContainer.innerHTML = `${minutes}:${seconds}`;
    if (--playTime < 0) {
      clearInterval(timer);
      gameOver();
    }
  }, 1000);
}

