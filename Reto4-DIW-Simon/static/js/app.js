
//VARIABLES DE ELEMENTOS HTML
var start = document.getElementById("start");
var mode = document.getElementById("mode");
var saveMode = document.getElementById("saveMode");
var difficulty = document.getElementById("difficulty");
var buttons = document.querySelectorAll('.button');
var score = document.getElementById('score');
var rankingButton = document.getElementById('rankingButton');
var scoreRanking = document.getElementById('scoreRanking');
var ranking = document.getElementById('ranking');
var hideRanking = document.getElementById('hideRanking');
var template = document.querySelector('template');
var scoreInt = 0;
var sounds = {
  green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
}

//VARIABLES INTERNAS JS
var difficultyValue;
var colors = ['red', 'green', 'blue', 'yellow'];
var time;
var playerSequence = [];
var sequence = [];
var isPlayerTurn = false;
//VARIABLES TABLA PUNTUACIONES
var playername;
var playerRanking=[];


rankingButton.addEventListener('click', function(){
  showTable();
  scoreRanking.showModal();
})

hideRanking.addEventListener('click', function(){
  scoreRanking.close();
})

start.addEventListener('click', function () {
  mode.showModal();
})

saveMode.addEventListener('click', function (e) {
  difficultyValue = difficulty.value;

  if (difficultyValue == "easy") {
    time = 900;
  } else if (difficultyValue == "medium") {
    time = 600
  } else if (difficultyValue == "hard") {
    time = 400;
  }
  mode.close();
  startGame();
})

function startGame() {
  generateSequence();
  playSequence();
}

// Función para generar una nueva secuencia
function generateSequence() {
  do {
    var randomIndex = Math.floor(Math.random() * colors.length);

  } while (randomIndex === sequence[sequence.length - 1] && randomIndex === sequence[sequence.length - 2]);
  sequence.push(colors[randomIndex]);

  for (i = 0; i < sequence.length; i++) {
    console.log(sequence[i]);
  }
}


//Funcion para los sonidos
function playSound(color) {
  var thisSound = color;
  sounds[thisSound].currentTime=0;
  sounds[thisSound].play();
};


// Función para reproducir la secuencia
function playSequence() {
  isPlayerTurn = false;
  var index = 0;
  var interval = setInterval(function () {
    if (index >= sequence.length) {
      clearInterval(interval);
      isPlayerTurn = true;
      return;
    }
    var color = sequence[index];
    flashButton(color);
    playSound(color);
    index++;
  }, time);
}

// Función para iluminar un botón
function flashButton(color) {
  var button = document.querySelector('.' + color);
  var activeClass = color + 'On';
  button.classList.add(activeClass);

  setTimeout(function () {
    button.classList.remove(activeClass);
  }, time / 2);
}

// Función para gestionar la entrada del jugador
function playerInput(color) {
  var i = 0;
  console.log("te toca")
  if (!isPlayerTurn) return;
  playerSequence.push(color);
  flashButton(color);
  playSound(color);
  checkSequence();
}

// Función para verificar la secuencia del jugador
function checkSequence() {
  if (playerSequence.length < sequence.length) {
    if (playerSequence[playerSequence.length - 1] != sequence[playerSequence.length - 1]) {
      alert('¡Perdiste! Intenta de nuevo.');
      sequence = [];
      playerSequence = [];
      loseGame();
      return;
    } else {
      switch (difficultyValue) {
        case "easy": scoreInt++;
          break;
        case "medium": scoreInt += 2;
          break;
        case "hard": scoreInt += 3;
      }
      score.innerText = scoreInt;

    }
  } else {
    if (playerSequence[playerSequence.length - 1] != sequence[playerSequence.length - 1]) {
      alert('¡Perdiste! Intenta de nuevo.');
      sequence = [];
      playerSequence = [];
      loseGame();
      return;
    } else {
      switch (difficultyValue) {
        case "easy": scoreInt++;
          break;
        case "medium": scoreInt += 2;
          break;
        case "hard": scoreInt += 3;
      }
      score.innerText = scoreInt;
      playerSequence = [];
      startGame();
    }
  }
}

function showTable(){
  let playerRankingJSON= localStorage.getItem("playerRanking");
  if(playerRankingJSON){
    let tableRanking = JSON.parse(playerRankingJSON);
    ranking.innerHTML = "";
    tableRanking.forEach(player => {
      let row = template.content.cloneNode(true);
      row.querySelector('.nameC').textContent = player.name;
      row.querySelector('.scoreC').textContent = player.score;
      row.querySelector('.difficultyC').textContent = player.difficulty;
      ranking.appendChild(row);
    });

  }else{
    let row = template.cloneNode(true);
    row.querySelector('.nameC').textContent = 'N/A';
      row.querySelector('.scoreC').textContent = 'N/A';
      row.querySelector('.difficultyC').textContent = 'N/A';
      ranking.appendChild(row);
  }
}
// Función de terminar el juego
function loseGame(){
  playername=null;
  playername=(prompt("Introduce tu nombre:").slice(0, 3));
  var difficultyValueTranslated;
  switch(difficultyValue){
    case 'easy': difficultyValueTranslated='Fácil';
    break;
    case 'medium': difficultyValueTranslated="Media";
    break;
    case 'hard': difficultyValueTranslated='Difícil';
  }
  let playerScore = {
    name: playername,
    score: score.innerText,
    difficulty: difficultyValueTranslated
  };
  let playerRankingJSON= localStorage.getItem("playerRanking");
  let playerRanking = playerRankingJSON ? JSON.parse(playerRankingJSON) : [];
  playerRanking.push(playerScore);
  playerRanking.sort(function(a,b){
    return b.score-a.score;
  });
  scoreInt=0;
  score.innerText = 0;

  if(playername===null){
    scoreInt=0;
    score.innerText = 0;
  }
  localStorage.setItem("playerRanking", JSON.stringify(playerRanking));
}