var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;


// ══════════════════ TIMER NA LOCAL STORAGE ══════════════════

var elapsed = parseInt(localStorage.getItem("gameTime")) || 0;
var lastTime = Date.now();


// ══════════════════ VARIAVEIS OBJETOS E SPRITES ══════════════════

var player = {
    x: 70,
    y: canvas.height/2,
    width: 60,
    height: 60,
    speed: 8,
    state: "idle-down"
};
const sprite = new Image();
sprite.src = "sprites/MC.png";

const egg = new Image();
egg.src = "sprites/egg.png";

const spritePos = [0, 0];
const spritePos1 = [0, 0];

const background1 = new Image();
background1.src = "cenario/fase3.png";


//Array de bolas
var balls = [];
var isPlayerMoving = false; //flag para as bolas nao cairem onde o player ta antes de ele se mover

var door = {
  x: 1130,
  y: 300,
  width: 70,
  height: 180
}

const spriteMap = {
    "idle-down" : [ [0,0] ],
    "idle-right": [ [2,0] ],
    "idle-up"   : [ [1,0] ],
    "idle-left" : [ [3,0] ],
    "walk-down" : [ [0,1],[0,2],[0,3],[0,0], ],
    "walk-right": [ [2,1],[2,2],[2,3],[2,0], ],
    "walk-up"   : [ [1,1],[1,2],[1,3],[1,0], ],
    "walk-left" : [ [3,1],[3,2],[3,3],[3,0], ]
  };


// ══════════════════ ÁUDIOS E LOCAL STORAGE ══════════════════

  var hit = new Audio()
  hit.src = "/sounds/hit.wav"

  let isMuted = localStorage.getItem("isMuted") === "true" || false;
  updateMuteState();
  
  muteButton.addEventListener("click", function() {
    isMuted = !isMuted;
    localStorage.setItem("isMuted", isMuted);
    updateMuteState();
  });
  
  function updateMuteState() {
    if (isMuted) {
      hit.volume = 0;
      document.getElementById("right_audio").muted = true;
      muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      hit.volume = 1;
      document.getElementById("right_audio").muted = true;
      muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  }




// ══════════════════ MOSTRAR TIMER ══════════════════

  function displayTime() {
    var elapsedSeconds = Math.floor(elapsed / 1000);
    var minutes = Math.floor(elapsedSeconds / 60);
    var seconds = elapsedSeconds % 60;
    var secondsString = seconds.toString().padStart(2, '0');
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(minutes + ":" + secondsString, 10, 30);
  }




// ══════════════════ CRIAÇÃO DAS BOLAS ══════════════════

setInterval(function(){
    if(balls.length < 8){ //vai gerar apenas 8 bolas máximo
        for(var i = 0; i < 8; i++){
          var ball = {
              x: getNewBallX(),
              y: 10,
              width: 40,
              height: 45,
              speed: Math.floor(Math.random() * 3) + 4
          };
        balls.push(ball);
        }
    }
}, 1500);

function getNewBallX() {
    var minDistance = 60; // distância minima entre bolas
    var newX;
      newX = Math.random() * (canvas.width - 380) + 190; //as bolas spawnam 190 pixeis dps do começo do canvas até 190 pixeis antes de o canvas acabar
        
    // confirmar se as bolas tao muito proximass umas das outras oara elas nao se sobreporem
    for (var i = 0; i < balls.length; i++) {
        if (Math.abs(newX - balls[i].x) < minDistance) {
          // se tiverem muito perto vai gerar um novo valor
          newX = getNewBallX();
          break;
        }
    }
        
  return newX;
}




// ══════════════════ MOVIMENTAÇÃO PLAYER ══════════════════

//move o personagem de uma forma mais clean
var keyState = {};
document.addEventListener("keydown", function(event){
  keyState[event.code] = true;
  isPlayerMoving = true;
});

document.addEventListener("keyup", function(event){
  keyState[event.code] = false;
});


function movePlayer(){
if (keyState["ArrowUp"] && player.y > 0) {
    player.y -= player.speed;
    player.state = "walk-up";
}
if (keyState["ArrowDown"] && player.y < canvas.height - player.height) {
    player.y += player.speed;
    player.state = "walk-down";

}
if (keyState["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
    player.state = "walk-left";
}
if (keyState["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += player.speed;
    player.state = "walk-right";

}




// ══════════════════ COLISAO COM AS BOLAS ══════════════════

for(var i = 0; i < balls.length; i++){
    var ball = balls[i];
    // Quando o player toca na bola é resetado para x e y coodernadas
    if(player.x < ball.x + ball.width && player.x + player.width > ball.x && player.y < ball.y + ball.height && player.y + player.height > ball.y){
      balls.splice(i, 1);
      hit.play();
      player.x = 100;
      player.y = canvas.height/2;
      isPlayerMoving = false;
    }

    //remove as bolas quando elas saiem do ecrã
    ball.y += ball.speed;
    if(ball.y > canvas.height - 70){
        balls.splice(i, 1);
    }
}
}

//IDLE
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




// ══════════════════ COLISAO PORTA ══════════════════

setInterval(function(){

movePlayer();

if(player.x < door.x + door.width && player.x + player.width > door.x && player.y < door.y + door.height && player.y + player.height > door.y){
    localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
    window.location.href = "faseFinal.html";
}

}, 1000/60);




// ══════════════════ FUNÇÃO DESENHAR ══════════════════

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(background1, 0, 0, canvas.width, canvas.height);

    //BOLAS
    //Desenhas as bolas
    for (var i = 0; i < balls.length; i++) {
      ctx.drawImage(egg, balls[i].x, balls[i].y, balls[i].width, balls[i].height);
    }
    //Move as bolas
    for(var i = 0; i < balls.length; i++){
        balls[i].y += balls[i].speed;
    }

    //PLAYER START
    const spriteCoords = spriteMap[player.state];
    
    // Encontra o frame atual dependendo do tempo
    const frameIndex = Math.floor(Date.now() / 200) % spriteCoords.length;
    
    spritePos[0] = spriteCoords[frameIndex][0] * 16;
    spritePos[1] = spriteCoords[frameIndex][1] * 16;
    
    ctx.drawImage(sprite, spritePos[0], spritePos[1], 16, 16, player.x, player.y, player.width, player.height);
    //PLAYER END

    //PORTA
    //ctx.fillStyle = "green";
    //ctx.fillRect(door.x, door.y, door.width, door.height);
    
    //TIMER
    var currentTime = Date.now();
    elapsed += currentTime - lastTime;
    lastTime = currentTime;

    displayTime();
  }

function update(){
  draw()
  requestAnimationFrame(update)
}

update();