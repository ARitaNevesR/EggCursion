// Get canvas element and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;

const background1 = new Image();
background1.src = "cenario/startscreen.png";
background1.onload = function() {
  update();
};

// Elementos
const startScreen = document.getElementById("start-screen");
const playButton = document.getElementById("play-button");
const creditsButton = document.getElementById("credits-button");

playButton.addEventListener("click", function() {
  window.location.href = "interecao.html";
});
creditsButton.addEventListener("click", function() {
  window.location.href = "creditosFinais.html";
});

function startGame() {
  canvas.style.display = "block";
  startScreen.style.display = "none";
}

function draw () {
  ctx.drawImage(background1, 0, 0, canvas.width, canvas.height);
}

function update() {
  draw()

  requestAnimationFrame(update);
}

playButton.addEventListener("click", function() {
  startGame();
  update();
});
