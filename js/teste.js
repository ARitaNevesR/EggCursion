const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;
 
// ══════════════════ TIMER ══════════════════

var startTime = Date.now();

// ══════════════════ VARIAVEIS OBJETOS E SPRITES ══════════════════

var player = {
  x: 70,
  y: 360,
  width: 60,
  height: 60,
  state: "idle-down",
};
const sprite = new Image();
sprite.src = "sprites/MC.png";

// posição default da sprite
const spritePos = [0, 0];

var lever = {
  x: 420,
  y: 660,
  height: 50,
  width: 60,
  pulled: false
};
const leverClosed = new Image();
leverClosed.src = "sprites/leverClosed.png"
const leverOpen = new Image();
leverOpen.src = "sprites/leverOpen.png"

var door = {
  x: 1130,
  y: 300,
  width: 170,
  height: 100,
  locked: true
}

const spriteMap = {
  "idle-down": [[0, 0]],
  "idle-right": [[2, 0]],
  "idle-up": [[1, 0]],
  "idle-left": [[3, 0]],
  "walk-down": [[0, 1],[0, 2],[0, 3],[0, 0]],
  "walk-right": [[2, 1],[2, 2],[2, 3],[2, 0]],
  "walk-up": [[1, 1],[1, 2],[1, 3],[1, 0]],
  "walk-left": [[3, 1],[3, 2],[3, 3],[3, 0]]
};

const background1 = new Image();
background1.src = "cenario/labirinto.png";

// ══════════════════ MAP ══════════════════


const cellSize = 30;
const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,],
  [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
];

// ══════════════════ ÁUDIOS E LOCAL STORAGE ══════════════════

var soundLever = new Audio();
soundLever.src = "/sounds/lever.mp3";

let isMuted = localStorage.getItem("isMuted") === "true" || false;
updateMuteState();

muteButton.addEventListener("click", function () {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted);
  updateMuteState();
});

function updateMuteState() {
  if (isMuted) {
    soundLever.volume = 0;
    muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    soundLever.volume = 1;
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
}


// ══════════════════ FUNÇÃO DESENHAR ══════════════════

function draw() {
  ctx.drawImage(background1, 0, 0, canvas.width, canvas.height);

  const spriteCoords = spriteMap[player.state];

  const frameIndex = Math.floor(Date.now() / 200) % spriteCoords.length;

  spritePos[0] = spriteCoords[frameIndex][0] * 16;
  spritePos[1] = spriteCoords[frameIndex][1] * 16;

  drawLever()
  //drawDoor()

  // Draw character sprite
  ctx.drawImage(sprite, spritePos[0], spritePos[1], 16, 16, player.x, player.y, player.width, player.height);

    drawMaze()

  //mostra o tempo
  displayTime();
}



// ══════════════════ MAZE ══════════════════
var walls = [];

function drawMaze() {
    walls = []; 

    // PAREDES EXTERIORES
    //ctx.fillStyle = "grey";
    ctx.fillStyle = "transparent"

    // ESQUERDA
    ctx.fillRect(0, 0, 70, 300);
        //colocar a parede dentro do array    
        walls.push({ x: 0, y: 0, width: 70, height: 300 });
    ctx.fillRect(0, 480, 70, 350);
        walls.push({ x: 0, y: 480, width: 70, height: 350 });
    
    // DIREITA
    ctx.fillRect(1130, 0, 70, 300);
        walls.push({ x: 1130, y: 0, width: 70, height: 300 });
    ctx.fillRect(1130, 480, 70, 350);
        walls.push({ x: 1130, y: 480, width: 70, height: 350 });
  
    // CIMA
    ctx.fillRect(0, 0, 1200, 70);
        walls.push({ x: 0, y: 0, width: 1200, height: 70 });
  
    // BAIXO
    ctx.fillRect(0, 730, 1200, 70);
        walls.push({ x: 0, y: 730, width: 1200, height: 70 });

    //PAREDES INTERIORES
    //PEDAÇO1
    ctx.fillRect(70, 273, 270, 35);
        walls.push({ x: 70, y: 273, width: 270, height: 35 });
    ctx.fillRect(303, 110, 35, 180);
        walls.push({ x: 303, y: 100, width: 35, height: 180 });
    ctx.fillRect(150, 110, 190, 35);
        walls.push({ x: 150, y: 110, width: 190, height: 35 });
    ctx.fillRect(150, 110, 35, 105);
        walls.push({ x: 150, y: 110, width: 35, height: 105 });
    ctx.fillRect(180, 180, 46, 35);
        walls.push({ x: 180, y: 180, width: 46, height: 35 });
    
    //PEDAÇO2
    ctx.fillRect(410, 110, 35, 192);
        walls.push({ x: 410, y: 110, width: 35, height: 200 });
    ctx.fillRect(440, 110, 150, 35);
        walls.push({ x: 440, y: 110, width: 150, height: 35 });
    
    //PEDAÇO3
    ctx.fillRect(160, 373, 295, 35);
        walls.push({ x: 160, y: 373, width: 295, height: 35 });
    ctx.fillRect(425, 400, 35, 110);
        walls.push({ x: 425, y: 400, width: 35, height: 110 });
    ctx.fillRect(260, 470, 170, 35);
        walls.push({ x: 260, y: 470, width: 170, height: 35 });

    //PEDAÇO4
    ctx.fillRect(130, 470, 35, 200);
        walls.push({ x: 130, y: 470, width: 35, height: 200 });
    ctx.fillRect(160, 470, 40, 35);
        walls.push({ x: 160, y: 470, width: 40, height: 35 });
    ctx.fillRect(150, 540, 120, 35);
        walls.push({ x: 150, y: 540, width: 120, height: 35 });
    ctx.fillRect(150, 635, 280, 35);
        walls.push({ x: 150, y: 635, width: 280, height: 35 });
    ctx.fillRect(393, 570, 35, 100);
        walls.push({ x: 393, y: 570, width: 35, height: 100 });
    ctx.fillRect(335, 543, 260, 35);
        walls.push({ x: 335, y: 543, width: 260, height: 35 });
    ctx.fillRect(565, 550, 35, 350);
        walls.push({ x: 565, y: 550, width: 35, height: 350 });
    ctx.fillRect(503, 390, 35, 180);
        walls.push({ x: 503, y: 390, width: 35, height: 180 });

    //PEDAÇO5
    ctx.fillRect(483, 620, 35, 120);
        walls.push({ x: 483, y: 620, width: 35, height: 120 });
    
    //PEDAÇO6
    ctx.fillRect(630, 590, 35, 160);
        walls.push({ x: 630, y: 590, width: 35, height: 160 });
    ctx.fillRect(863, 660, 35, 70);
        walls.push({ x: 863, y: 660, width: 35, height: 70 });

    //PEDAÇO7
    ctx.fillRect(903, 110, 35, 120);
        walls.push({ x: 903, y: 110, width: 35, height: 120 });
    ctx.fillRect(930, 110, 140, 35);
        walls.push({ x: 930, y: 110, width: 140, height: 35 });
    ctx.fillRect(1033, 60, 35, 70);
        walls.push({ x: 1033, y: 60, width: 35, height: 70 });

    //PEDAÇO8
    ctx.fillRect(513, 190, 35, 120);
        walls.push({ x: 513, y: 190, width: 35, height: 120 });
    ctx.fillRect(540, 190, 160, 35);
        walls.push({ x: 540, y: 190, width: 160, height: 35 });
    ctx.fillRect(693, 140, 35, 230);
        walls.push({ x: 693, y: 140, width: 35, height: 230 });
    ctx.fillRect(640, 110, 180, 35);
        walls.push({ x: 640, y: 110, width: 180, height: 35 });
    ctx.fillRect(783, 140, 35, 140);
        walls.push({ x: 783, y: 140, width: 35, height: 140 });
    ctx.fillRect(720, 330, 110, 35);
        walls.push({ x: 720, y: 330, width: 110, height: 35 });
    ctx.fillRect(825, 330, 35, 128);
        walls.push({ x: 825, y: 330, width: 35, height: 128 });
    ctx.fillRect(825, 450, 115, 35);
        walls.push({ x: 825, y: 350, width: 35, height: 35 });
    ctx.fillRect(903, 280, 35, 200);
        walls.push({ x: 903, y: 280, width: 35, height: 200 });
    ctx.fillRect(623, 270, 70, 35);
        walls.push({ x: 623, y: 270, width: 70, height: 35 });
    ctx.fillRect(623, 300, 35, 180);
        walls.push({ x: 623, y: 300, width: 35, height: 180 });
    ctx.fillRect(655, 423, 120, 35);
        walls.push({ x: 655, y: 423, width: 120, height: 35 });
    ctx.fillRect(741, 450, 35, 190);
        walls.push({ x: 741, y: 450, width: 35, height: 190 });
    ctx.fillRect(775, 530, 215, 35);
        walls.push({ x: 775, y: 530, width: 215, height: 35 });
    ctx.fillRect(980, 250, 35, 410);
        walls.push({ x: 980, y: 250, width: 35, height: 410 });
    ctx.fillRect(1015, 625, 47, 35);
        walls.push({ x: 1015, y: 625, width: 47, height: 35 });
    ctx.fillRect(1015, 250, 120, 35);
        walls.push({ x: 1015, y: 250, width: 120, height: 35 });
}

// ══════════════════ TIMER ══════════════════


function displayTime() {
  var currentTime = new Date();
  var elapsedTime = new Date(currentTime - startTime);
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(
    elapsedTime.getMinutes() +
      ":" +
      elapsedTime.getSeconds().toString().padStart(2, "0"),
    10,
    30
  );
}


// ══════════════════ ALAVANCA ══════════════════

function drawLever() {
  if (!lever.pulled) {
    ctx.drawImage(leverClosed, lever.x, lever.y, lever.height, lever.width);
  } else {
    ctx.drawImage(leverOpen, lever.x, lever.y, lever.height, lever.width);

  }
}

// verificar se a alavanca foi puxada
function checkLever() {
  if (
    player.x >= lever.x &&
    player.x <= lever.x + 10 &&
    player.y >= lever.y &&
    player.y <= lever.y + 30 &&
    !lever.pulled
  ) {
    lever.pulled = true;
    door.locked = false;
    soundLever.play();
  }
}

// ══════════════════ PORTA ══════════════════

/*
function drawDoor() {
  if (door.locked) {
    ctx.fillStyle = "red";
  } else {
    ctx.fillStyle = "green";
  }
  ctx.fillRect(door.x, door.y, door.height, door.width);
}
*/

// ══════════════════ COLISÕES ══════════════════

function movePlayer(dx, dy) {
    const cellSize = 40;
    const buffer = 5; // Buffer value to create a gap between the player and the walls
    const nextX = player.x + dx;
    const nextY = player.y + dy;
    const nextI = Math.floor(nextY / cellSize);
    const nextJ = Math.floor(nextX / cellSize);
  
    // Check if the next position is within the canvas boundaries
    if (
      nextX >= 0 &&
      nextX + player.width <= canvas.width &&
      nextY >= 0 &&
      nextY + player.height <= canvas.height
    ) {
      // Check if the next position collides with a wall
      for (const wall of walls) {
        if (
          nextX + player.width - buffer >= wall.x &&
          nextX + buffer <= wall.x + wall.width &&
          nextY + player.height - buffer >= wall.y &&
          nextY + buffer <= wall.y + wall.height
        ) {
          // The player collides with a wall, prevent movement
          return;
        }
      }
  
      // Update the player's position
      player.x = nextX;
      player.y = nextY;
    }
  
    checkLever();
  }
  
// ══════════════════ MOVIMENTAÇÃO PLAYER ══════════════════

document.addEventListener("keydown", keydownHandler);

// Function to handle keypresses
function keydownHandler(e) {
  switch (e.keyCode) {
    case 37: // left
      movePlayer(-10, 0);
      player.state = "walk-left";
      break;
    case 38: // up
      movePlayer(0, -10);
      player.state = "walk-up";
      break;
    case 39: // right
      movePlayer(10, 0);
      player.state = "walk-right";
      break;
    case 40: // down
      movePlayer(0, 10);
      player.state = "walk-down";
      break;
  }
  if (!door.locked) {
    if (player.x + player.width >= door.x && player.x <= door.x + door.width && player.y + player.height >= door.y && player.y <= door.y + door.height) {
      var currentTime = Date.now() - startTime;
      localStorage.setItem("gameTime", currentTime);
      window.location.href = "fase2.html";
    }
  }
}

function checkIdle() {
  if (!keyPressed) {
    if (player.state === "walk-up") {
      player.state = "idle-up";
    } else if (player.state === "walk-down") {
      player.state = "idle-down";
    } else if (player.state === "walk-left") {
      player.state = "idle-left";
    } else if (player.state === "walk-right") {
      player.state = "idle-right";
    }
  }
}

document.addEventListener("keyup", keyupHandler);

function keyupHandler(event) {
  if (event.key.startsWith("Arrow")) {
    keyPressed = false;
  }
}

setInterval(checkIdle, 100); // Call checkIdle every 100 milliseconds

// ══════════════════ FUNÇÃO UPDATE ══════════════════


function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();

  requestAnimationFrame(update);
}

update();
