const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


canvas.width = 1200;
canvas.height = 800;



// ══════════════════ TIMER NA LOCAL STORAGE ══════════════════

var elapsed = parseInt(localStorage.getItem("gameTime")) || 0;
var lastTime = Date.now();




// ══════════════════ VARIAVEIS OBJETOS E SPRITES ══════════════════

var player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  state: "idle-down"
};
const sprite = new Image();
sprite.src = "sprites/MC.png";

const spritePos = [0, 0];


var doorRight = {
  x: 1130,
  y: 300,
  width: 70,
  height: 180
}

var doorUp = {
  x: 510,
  y: 0,
  width: 160,
  height: 70
}

var doorLeft = {
  x: 0,
  y: 300,
  width: 70,
  height: 180
}

var doorDown = {
  x: 510,
  y: 730,
  width: 160,
  height: 70
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


const background1 = new Image();
background1.src = "cenario/quarto1.png";

// ══════════════════ ÁUDIOS E LOCAL STORAGE ══════════════════

let isMuted = localStorage.getItem("isMuted") === "true" || false;
updateMuteState();
        
muteButton.addEventListener("click", function() {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted);
  updateMuteState();
});
        
function updateMuteState() {
  if (isMuted) {
    document.getElementById("right_audio").muted = true;
    muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    document.getElementById("right_audio").muted = false;
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  }




// ══════════════════ FUNÇÃO DESENHAR ══════════════════

  function draw() {  
    ctx.drawImage(background1, 0, 0, canvas.width, canvas.height);

    /*
    ctx.fillStyle = "green";
    ctx.fillRect(doorUp.x, doorUp.y, doorUp.width, doorUp.height);

    ctx.fillStyle = "green";
    ctx.fillRect(doorRight.x, doorRight.y, doorRight.width, doorRight.height);

    ctx.fillStyle = "green";
    ctx.fillRect(doorDown.x, doorDown.y, doorDown.width, doorDown.height);

    ctx.fillStyle = "green";
    ctx.fillRect(doorLeft.x, doorLeft.y, doorLeft.width, doorLeft.height);
    */

    //START PLAYER
    const spriteCoords = spriteMap[player.state];
    
    const frameIndex = Math.floor(Date.now() / 200) % spriteCoords.length;
    
    spritePos[0] = spriteCoords[frameIndex][0] * 16;
    spritePos[1] = spriteCoords[frameIndex][1] * 16;
    
    ctx.drawImage(sprite, spritePos[0], spritePos[1], 16, 16, player.x, player.y, player.width, player.height);
    //END PLAYER

    displayTime();
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




// ══════════════════ MOVIMENTAÇÃO PLAYER ══════════════════

  document.addEventListener("keydown", keydownHandler);

  function keydownHandler(event) {
    // Check if player is inside the canvas and conversation is not active
      if (event.key === "ArrowUp" && player.y > 0) {
        player.y -= 10;
        player.state = "walk-up";
      }
      if (event.key === "ArrowDown" && player.y < canvas.height - player.height) {
        player.y += 10;
        player.state = "walk-down";
      }
      if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= 10;
        player.state = "walk-left";
      }
      if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += 10;
        player.state = "walk-right";
      }

      if (player.x + player.width >= doorUp.x && player.x <= doorUp.x + doorUp.width && player.y + player.height >= doorUp.y && player.y <= doorUp.y + doorUp.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fase2.html";
      }

      if (player.x + player.width >= doorDown.x && player.x <= doorDown.x + doorDown.width && player.y + player.height >= doorDown.y && player.y <= doorDown.y + doorDown.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fase2.html";
      }

      if (player.x + player.width >= doorRight.x && player.x <= doorRight.x + doorRight.width && player.y + player.height >= doorRight.y && player.y <= doorRight.y + doorRight.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fase2-quarto5.html";
      }

      if (player.x + player.width >= doorLeft.x && player.x <= doorLeft.x + doorLeft.width && player.y + player.height >= doorLeft.y && player.y <= doorLeft.y + doorLeft.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fase2.html";
      }
  }

  function checkIdle() {
    if (!keyPressed) { // keyPressed is a boolean flag that you can set to true in keydownHandler and false in keyupHandler
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



  
// ══════════════════ UPDATE ══════════════════

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

    var currentTime = Date.now();
    elapsed += currentTime - lastTime;
    lastTime = currentTime;

    requestAnimationFrame(update);
}

update();