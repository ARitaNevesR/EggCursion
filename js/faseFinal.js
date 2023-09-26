const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;



// ══════════════════ TIMER NA LOCAL STORAGE ══════════════════

var elapsed = parseInt(localStorage.getItem("gameTime")) || 0;
var lastTime = Date.now();
var timerId;



// ══════════════════ VARIAVEIS OBJETOS E SPRITES ══════════════════

const spritePos = [0, 0];
const spritePos1 = [0, 0];
const spritePos2 = [0, 0];

var player = {
  x: 100,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  state: "idle-down"
};
const sprite = new Image();
sprite.src = "sprites/MC.png";

var egg = {
    x: 790,
    y: 350,
    width: 100,
    height: 105
  }
const sprite1 = new Image();
sprite1.src = "sprites/egg.png";

var npc1 = {
  x: 350,
  y: canvas.height / 2,
  width: 60,
  height: 60,
}
const sprite2 = new Image();
sprite2.src = "sprites/npc1.png";


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

const spriteMap2 = {
  "idle-down" : [ [0,0] ],
  };

  const messageBox = new Image();
  messageBox.src = "sprites/box.png"
  
  const background1 = new Image();
  background1.src = "cenario/finalFase.png";
  

// ══════════════════ CONVERSA VARIAVEIS ══════════════════

  var conversationIndex = 0; 
  var conversationMessages = [
    "Funcionário: Bem-vindo ao quarto final!",
    "Funcionário: O ovo encontra-se à sua espera.",
    "Funcionário: Aproxime-se para o apanhar e completar a sua missão!"
  ];
  var conversationActive = false;
  var conversationEnded = false;
  var conversationTriggered = false;
  var conversationDistance = 50;



  // ══════════════════ ÁUDIOS E LOCAL STORAGE ══════════════════

  var conv = new Audio();
  conv.src = "/sounds/talkingsynth.mp3";

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
      muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      conv.volume = 1;
      muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  }
  



  // ══════════════════ FUNÇÃO DESENHAR ══════════════════

  function draw() {
    ctx.drawImage(background1, 0, 0, canvas.width, canvas.height);

    const spriteCoords = spriteMap[player.state];

    ctx.drawImage(sprite1, egg.x, egg.y, egg.width, egg.height);
    ctx.drawImage(sprite2, spritePos2[0], spritePos2[1], 16, 16, npc1.x, npc1.y, npc1.width, npc1.height);

    
    // Get the current frame based on the current time
    const frameIndex = Math.floor(Date.now() / 200) % spriteCoords.length;
    
    // Get the sprite position for the current frame
    spritePos[0] = spriteCoords[frameIndex][0] * 16;
    spritePos[1] = spriteCoords[frameIndex][1] * 16;
    
    // Draw character sprite
    ctx.drawImage(sprite, spritePos[0], spritePos[1], 16, 16, player.x, player.y, player.width, player.height);
    
    displayTime();
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



// ══════════════════ MOSTRAR TIMER ══════════════════

  function displayTime() {
    var elapsedSeconds = Math.floor(elapsed / 1000);
    var minutes = Math.floor(elapsedSeconds / 60);
    var seconds = elapsedSeconds % 60;
    var secondsString = seconds.toString().padStart(2, '0');
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(minutes + ":" + secondsString , 10, 30);
  }




// ══════════════════ MOVIMENTAÇÃO PLAYER ══════════════════

  document.addEventListener("keydown", keydownHandler);

  function redirectToCredits() {
    window.location.href = "creditosFinais.html";
  }

  function keydownHandler(event) {
    if (!conversationActive) {
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
  
  
      //Confirma se o npc está perto do player
      var dx = npc1.x - player.x;
      var dy = npc1.y - player.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < conversationDistance && !conversationTriggered) {
        conversationActive = true;
        conversationIndex = 0;
        conversationTriggered = true;
        document.removeEventListener("keydown", keydownHandler);
      }
  
    // Confirma se o player tocou no ovo
    if (player.x + player.width >= egg.x && player.x <= egg.x + egg.width && player.y + player.height >= egg.y && player.y <= egg.y + egg.height) {
      //Pause o timer
      clearInterval(timerId);

      //MOSTRA UMA PROMPT COM O TEMPO FINAL
      var elapsedSeconds = Math.floor(elapsed / 1000);
      var minutes = Math.floor(elapsedSeconds / 60);
      var seconds = elapsedSeconds % 60;
      var secondsString = seconds.toString().padStart(2, '0');
      var message = "You found the egg in " + minutes + " minutes and " + secondsString + " seconds!";
      alert(message);

      redirectToCredits();
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




// ══════════════════ UPDATE ══════════════════

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  
    //Timer
    var currentTime = Date.now();
    elapsed += currentTime - lastTime;
    lastTime = currentTime;
  
    timerId = setInterval(checkIdle, 100); //Atribui o valor do setInterval para o TimerID
  
    //Configurações da Converas
    if (conversationActive) {
      ctx.drawImage(messageBox, 0, 600, canvas.width, canvas.height - 600);
      ctx.fillStyle = "white";
      ctx.font = "25px Poppins";
      conv.play()
      // Divide a conversa em duas partes por causa do "Gerente: Conversa"
      var conversationParts = conversationMessages[conversationIndex].split(':');
  
      //Desenha ambas as partes em separado
      ctx.fillText(conversationParts[0] + ':', 60, canvas.height - 140);
      ctx.fillText(conversationParts[1], 60, canvas.height - 100);
  
      if (conversationIndex >= conversationMessages.length) {
        conversationActive = false;
        conversationEnded = true;
        conversationTriggered = false;
        document.addEventListener("keydown", keydownHandler);
      }
  
      //Se a conversa tiver acabado!
    } else if (conversationEnded) {
      var dx = npc1.x - player.x;
      var dy = npc1.y - player.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= conversationDistance) {
        conversationEnded = false;
      }
    }

    requestAnimationFrame(update);
  }

update();