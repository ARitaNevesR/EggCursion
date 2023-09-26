const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;

// ══════════════════ VARIAVEIS OBJETOS E SPRITES ══════════════════

var door = {
  x: 1130,
  y: 300,
  width: 70,
  height: 180
}

var player = {
  x: 150,
  y: canvas.height / 2,
  width: 60,
  height: 60,
  state: "idle-down"
};
const sprite = new Image();
sprite.src = "sprites/MC.png";

var npc1 = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 60,
  height: 60,
}
const sprite1 = new Image();
sprite1.src = "sprites/NPC1.png";

//procura a posição default da sprite
const spritePos = [0, 0];
const spritePos1 = [0, 0];

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
background1.src = "cenario/interacao.png";


// ══════════════════ CONVERSA VARIAVEIS ══════════════════

var conversationIndex = 0; //mensagem atual!
var conversationMessages = [
  "Gerente: Olá, funcionário! Hoje tenho uma tarefa especial para você.",
  "Gerente: Como deve saber, o nosso mestre quer ovos...",
  "Gerente: Mas, infelizmente, nenhum dos nossos outros funcionários querem fazer isso,",
  "Gerente: então vai ter que ser você.",
  "Gerente: Mas, não se preocupe, é uma tarefa simples!",
  "Gerente: Bem, na verdade, não é tão simples assim...",
  "Gerente: Vais ter que passar por três níveis para chegar ao ovo. Sim, três!",
  "Gerente: Mas hey, pelo menos vai ser uma oportunidade para mostrar as suas capacidades!",
  "Gerente: O mestre está à tua espera!",
  "Gerente: Passa pela porta atrás de mim para começar!",
  "Gerente: Não demores!! Tic Toc!!"
];

//flags para a conversa!!
var conversationActive = false; 
var conversationEnded = false; 
var conversationTriggered = false; 
var conversationDistance = 40; 

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
  
  ctx.drawImage(sprite1, spritePos1[0], spritePos1[1], 16, 16, npc1.x, npc1.y, npc1.width, npc1.height);

  //ctx.fillStyle = "green";
  //ctx.fillRect(door.x, door.y, door.width, door.height);

  //START PLAYER
  const spriteCoords = spriteMap[player.state];
  const frameIndex = Math.floor(Date.now() / 200) % spriteCoords.length;
  
  spritePos[0] = spriteCoords[frameIndex][0] * 16;
  spritePos[1] = spriteCoords[frameIndex][1] * 16;
  
  ctx.drawImage(sprite, spritePos[0], spritePos[1], 16, 16, player.x, player.y, player.width, player.height);
  //END PLAYER
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
  // Check if player is inside the canvas and conversation is not active
  if (!conversationActive) {
    if (event.key === "ArrowUp" && player.y > 0) {
      player.y -= 15;
      player.state = "walk-up";
    }
    if (event.key === "ArrowDown" && player.y < canvas.height - player.height) {
      player.y += 15;
      player.state = "walk-down";
    }
    if (event.key === "ArrowLeft" && player.x > 0) {
      player.x -= 15;
      player.state = "walk-left";
    }
    if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
      player.x += 15;
      player.state = "walk-right";
    }


    // Ve a distância do player com o npc
    var dx = npc1.x - player.x;
    var dy = npc1.y - player.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < conversationDistance && !conversationTriggered) {
      conversationActive = true;
      conversationIndex = 0;
      conversationTriggered = true;
      document.removeEventListener("keydown", keydownHandler);
    }

     // Se o player tocar na porta
     if (player.x + player.width >= door.x && player.x <= door.x + door.width && player.y + player.height >= door.y && player.y <= door.y + door.height) {
      window.location.href = "fase1.html";
    }
  }
}

//Idle animation
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

document.addEventListener("keydown", keydownHandler);



// ══════════════════ Função Update ══════════════════


function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  
  if (conversationActive) {
    ctx.drawImage(messageBox, 0, 600, canvas.width, canvas.height - 600);
    ctx.fillStyle = "white";
    ctx.font = "25px Poppins";
    conv.play()

    // Divide a conversa em duas partes (para deixar o gerente em outro paragrafo)
    var conversationParts = conversationMessages[conversationIndex].split(':');

    // Desenha as partes e separado
    ctx.fillText(conversationParts[0] + ':', 60, canvas.height - 140);
    ctx.fillText(conversationParts[1], 60, canvas.height - 100);

    if (conversationIndex >= conversationMessages.length) {
      conversationActive = false;
      conversationEnded = true;
      conversationTriggered = false;
      document.addEventListener("keydown", keydownHandler);
    }

  } else if (conversationEnded) {
    //Reseta a conversa se o player se mover longe demais
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
