const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas width and height
canvas.width = 600;
canvas.height = 400;

var elapsed = parseInt(localStorage.getItem("gameTime")) || 0;
var lastTime = Date.now();

var player = {
  x: 50,
  y: 200,
  width: 30,
  height: 30,
  state: "idle-down"
};

// Create Image object for character sprite
const sprite = new Image();
sprite.src = "sprites/MC.png";

// Set default sprite position
const spritePos = [0, 0];


var door = {
    x: 580,
    y: 180,
    width: 30,
    height: 50
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

  function draw() {

    ctx.fillStyle = "green";
    ctx.fillRect(door.x, door.y, door.width, door.height);
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

  function displayTime() {
    var elapsedSeconds = Math.floor(elapsed / 1000);
    var minutes = Math.floor(elapsedSeconds / 60);
    var seconds = elapsedSeconds % 60;
    var secondsString = seconds.toString().padStart(2, '0');
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(minutes + ":" + secondsString, 10, 30);
  }
  
  
  document.addEventListener("keydown", keydownHandler);

  // Create a variable to store the last direction the player moved in
  var lastDirection = "down";


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

      if (player.x + player.width >= door.x && player.x <= door.x + door.width && player.y + player.height >= door.y && player.y <= door.y + door.height) {
        localStorage.setItem("gameTime", elapsed + (Date.now() - lastTime));
        window.location.href = "fim2.html";
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

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  
    var currentTime = Date.now();
    elapsed += currentTime - lastTime;
    lastTime = currentTime;
  
    requestAnimationFrame(update);
  }

update();