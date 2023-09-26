const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;

// ══════════════════ TIMER NA LOCAL STORAGE ══════════════════

var elapsed = parseInt(localStorage.getItem("gameTime")) || 0;
var lastTime = Date.now();


// ══════════════════ VARIAVEIS OBJETOS E SPRITES ══════════════════

var player = {
  x: 100,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  state: "idle-down"
};
const sprite = new Image();
sprite.src = "sprites/MC.png";

var npc2 = {
  x: 600,
  y: canvas.height / 2,
  width: 60,
  height: 60,
}
const sprite1 = new Image();
sprite1.src = "sprites/NPC2.png";

const spritePos = [0, 0];
const spritePos1 = [0, 0];

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

const spriteMap1 = {
  "idle-down" : [ [0,0] ],
};

const messageBox = new Image();
messageBox.src = "sprites/box.png"

const background1 = new Image();
background1.src = "cenario/fase2.png";

// ══════════════════ CONVERSA VARIAVEIS ══════════════════

  var conversationIndex = 0; // Index of the current conversation message
  var conversationMessages = [
    "↓ ← ↑ ↑ → ↓"
  ];
  var conversationActive = false; // Flag to indicate if a conversation is currently active
  var conversationEnded = false; // Flag to indicate if the conversation has ended
  var conversationTriggered = false; // Flag to indicate if a conversation has been triggered after the last one ended
  var conversationDistance = 50; // Distance the player needs to move away from the NPC to trigger a new conversation


// ══════════════════ ÁUDIOS E LOCAL STORAGE ══════════════════

  var conv = new Audio()
  conv.src = "/sounds/talkingsynth.mp3"
  
  let isMuted = localStorage.getItem("isMuted") === "true" || false;
  updateMuteState();
  
  muteButton.addEventListener("click", function() {
    isMuted = !isMuted;
    localStorage.setItem("isMuted", isMuted);
    updateMuteState();
  });
  
  function updateMuteState() {
    if (isMuted) {
      conv.volume = 0;
      // Add any other sounds you want to mute here
      muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      conv.volume = 1;
      // Add any other sounds you want to unmute here
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
    */  

    // Draw character sprite
  ctx.drawImage(sprite1, spritePos1[0], spritePos1[1], 16, 16, npc2.x, npc2.y, npc2.width, npc2.height);

    // Get the sprite coordinates for the current state
    const spriteCoords = spriteMap[player.state];
    
    // Get the current frame based on the current time
    const frameIndex = Math.floor(Date.now() / 200) % spriteCoords.length;
    
    // Get the sprite position for the current frame
    spritePos[0] = spriteCoords[frameIndex][0] * 16;
    spritePos[1] = spriteCoords[frameIndex][1] * 16;
    
    // Draw character sprite
    ctx.drawImage(sprite, spritePos[0], spritePos[1], 16, 16, player.x, player.y, player.width, player.height);
  
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



  // ══════════════════ CONVERSA JAVA ══════════════════

  canvas.addEventListener("click", event => {
    if (conversationActive) {
      conversationIndex++;
      if (conversationIndex >= conversationMessages.length) {
        conversationActive = false;
        conv.pause()
        document.addEventListener("keydown", keydownHandler);
      }
    }
  });
  

// ══════════════════ MOVIMENTAÇÃO PLAYER ══════════════════

  document.addEventListener("keydown", keydownHandler);

  function keydownHandler(event) {
    if (!conversationActive) {
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

      //confirma se há um npc perto do player
      var dx = npc2.x - player.x;
      var dy = npc2.y - player.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < conversationDistance && !conversationTriggered) {
        conversationActive = true;
        conversationIndex = 0;
        conversationTriggered = true;
        document.removeEventListener("keydown", keydownHandler);
    }

      //teleports!
      if (player.x + player.width >= doorUp.x && player.x <= doorUp.x + doorUp.width && player.y + player.height >= doorUp.y && player.y <= doorUp.y + doorUp.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fase2.html";
      }

      if (player.x + player.width >= doorDown.x && player.x <= doorDown.x + doorDown.width && player.y + player.height >= doorDown.y && player.y <= doorDown.y + doorDown.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fase2-quarto1.html";
      }

      if (player.x + player.width >= doorRight.x && player.x <= doorRight.x + doorRight.width && player.y + player.height >= doorRight.y && player.y <= doorRight.y + doorRight.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fase2.html";
      }
  }}

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
  
  setInterval(checkIdle, 100);


  // ══════════════════ UPDATE ══════════════════

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

    if (conversationActive) {
      ctx.drawImage(messageBox, 0, 600, canvas.width, canvas.height - 600);
      ctx.fillStyle = "white";
      ctx.font = "25px Poppins";
      conv.play()
      conv.play()
  
      // Draw the two parts separately
      ctx.fillText(conversationMessages , 60, canvas.height - 100);
  
      if (conversationIndex >= conversationMessages.length) {
        conversationActive = false;
        conversationEnded = true;
        conversationTriggered = false;
        document.addEventListener("keydown", keydownHandler);
      }
  
    } else if (conversationEnded) {
      var dx = npc2.x - player.x;
      var dy = npc2.y - player.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= conversationDistance) {
        conversationEnded = false;
      }
    }

    var currentTime = Date.now();
    elapsed += currentTime - lastTime;
    lastTime = currentTime;
    
    requestAnimationFrame(update);
}

update();