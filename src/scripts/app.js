const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//function for updateing score
function updateScore(score) {
  ctx.font = '48px serif';
  ctx.fillText('Score: ' + score, 10, canvas.height-50);
}

//backgroundImg drawing function
function drawBackgroundImg() {
  const backgroundImg = new Image();
  backgroundImg.src = "./img/background.png";
  ctx.drawImage(backgroundImg,0,0);
}
//ground class
class Ground {
  constructor() {
    this.groundImg = new Image();
    this.groundImg.src = "./img/ground.png"
    this.height = this.groundImg.height
  }
  draw(){
    ctx.drawImage(this.groundImg,0,canvas.height - this.height)
  }
}
//pipe class
class Pipe {
  constructor() {
    this.x = canvas.width;
    this.dy = Math.random() * 200;

    this.pipeImg = new Image();
    this.pipeImg.src = "./img/pipeNorth.png";
    this.pipeImg1 = new Image();
    this.pipeImg1.src = "./img/pipeSouth.png";

    this.width = this.pipeImg.width;
    this.height = this.pipeImg.height;
    this.y1 = 0 - this.dy;
    this.y2 = this.height - this.dy + 100;
  }
  draw(){
    ctx.drawImage(this.pipeImg,this.x,this.y1);
    ctx.drawImage(this.pipeImg1,this.x,this.y2);
  }
  update(){
    this.draw();
    this.x += -0.9;
  }
}

//keyboard events
let accleration = 1;
let fired = false
addEventListener("keydown",(e)=>{
  if (fired) {
    accleration = 3
  }else{
    fired = true;
    accleration = -3
  }
})
addEventListener("keyup",(e)=>{
  accleration = 3
  fired = false
})

//flappy bird class
class Bird {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.birdImg = new Image();
    this.birdImg.src = "./img/bird.png";
    this.width = this.birdImg.width;
    this.height = this.birdImg.height;
  }
  draw() {
    ctx.drawImage(this.birdImg,this.x,this.y);
  }
  update(){
    this.draw();
    this.y += accleration;
  }
}
//initialisation
const flappyBird = new Bird(50,canvas.height/2-200)
const ground = new Ground();
let pipes = [];
let timer = 0;
let score = 0;
let gameState = true
//animate function
function animate() {
  if (gameState === true) {
      requestAnimationFrame(animate);
  }
  drawBackgroundImg();
  flappyBird.update();
  if (timer === 250) {
    pipes.push(new Pipe);
    timer = 0;
  }
  pipes.forEach((pipe, i) => {
    pipe.update()
    if (pipe.x < -80) {
      pipes.splice(i,1);
    }
    //score determining
    if(flappyBird.x - pipe.x>1 && flappyBird.x - pipe.x <2){
      score++;
    }
    //gameover conditions
    if((flappyBird.y < pipe.y1 + pipe.height || flappyBird.y > pipe.y2-flappyBird.height) && (flappyBird.x > pipe.x && flappyBird.x < pipe.x + pipe.width)){
      gameState = false
    }
    if(flappyBird.x + flappyBird.width > pipe.x && flappyBird.x + flappyBird.width < pipe.x + 20 && flappyBird.y > 0 && flappyBird.y < pipe.y1 + pipe.height){
      gameState = false
    }
    if(flappyBird.x + flappyBird.width > pipe.x && flappyBird.x + flappyBird.width < pipe.x + 20 && flappyBird.y > pipe.y2-flappyBird.height){
      gameState = false
    }
    if (flappyBird.y+flappyBird.height > canvas.height - ground.height) {
      gameState = false
    }
    //end of gameover conditions
  });
  ground.draw();
  updateScore(score)
  timer++;
}

animate();
