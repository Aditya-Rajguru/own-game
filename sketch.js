var ground, invisibleGround,bg,bgimage,surfer,surferimage,coin,coinimage,train,trainimage;
var electricpole,electricpoleimage;
var PLAY = 1;
var END = 0; 
var gameState = PLAY;
var score;
var invisibleSprite;
var dollars=0
var coinGroup,obstacleGroup
var isGroup;
var moneybag,moneybagimg;
var gameover,gameoverimg;
var database;
var coinsound,crashsound;



function preload(){
bgimage=loadImage("background.jpg");
surferimage=loadImage("player.png");
coinimage=loadImage("coin.png");
trainimage=loadImage("train.png");
electricpoleimage=loadImage("elctricpole.png");
moneybagimg=loadImage("moneybag.png");
gameoverimg=loadImage("gameover.png");
coinsound=loadSound("chimes_short_text (1).mp3")
crashsound=loadSound("accident.mp3");
}

function setup() {
createCanvas(1000,700);
database=firebase.database();

bg=createSprite(500,350,2000,700);
surfer=createSprite(900,550,10,10);
surfer.addImage(surferimage);
surfer.scale=0.5;
//surfer.debug=true;
invisibleGround=createSprite(500,650,2000,10);
invisibleGround.velocityX=-2;
invisibleGround.visible=false;
//coin=createSprite();
//train=createSprite();
//electricpole=createSprite();
bg.addImage(bgimage);
bg.scale=2.5;

console.log(displayWidth);
console.log(width);
obstacleGroup=new Group();
coinGroup=new Group();
isGroup=new Group();
isGroup.visible=false;
moneybag=createSprite(800,50,10,10);
moneybag.addImage(moneybagimg);
moneybag.scale=0.09;
gameover=createSprite(500,350,20,20);
gameover.addImage(gameoverimg);
gameover.visible=false;
//fetching coins from the database;
database.ref('money').on("value",fetchmoney,showerror)

}

function draw() {
  background(180);
if(gameState===PLAY){

  bg.velocityX=-2;
if(bg.x<0){
  bg.x=bg.width/2;
}
if(invisibleGround.x<0){
  invisibleGround.x=invisibleGround.width/2;
}



if(keyDown("space")){
  surfer.velocityY=-10;
}
surfer.velocityY=surfer.velocityY+1;

if(coinGroup.isTouching(surfer)){
  dollars=dollars+10;
coinGroup.destroyEach();
updatemoney(dollars);
coinsound.play();
}
if(obstacleGroup.isTouching(surfer)){
 gameState=END;
 crashsound.play();


}


if(isGroup.isTouching(surfer)){
  surfer.collide(isGroup);

}

spawnobstacles();
spawnCoins();
}
if(gameState===END){
  obstacleGroup.setVelocityXEach(0);
  coinGroup.setVelocityXEach(0);
isGroup.setVelocityXEach(0);
bg.velocityX=0;

surfer.velocityY=0; 
gameover.visible=true;

}

if(gameState===END&&keyDown("r")){
  gameState=PLAY;
  obstacleGroup.destroyEach();
  updatemoney(0);
  gameover.visible=false;

  
  }
surfer.collide(invisibleGround);

  drawSprites();
  textSize(40);
  fill("brown");
  text(dollars,830,60);
} 

function spawnCoins(){
if(frameCount%50===0){
  coin=createSprite(0,600,20,20);
  coin.addImage(coinimage);
  coin.velocityX=5;
  coin.scale=0.05;
  coin.y=random(100,600);
  coinGroup.add(coin);
}

}
  


function spawnobstacles(){
if(frameCount%200===0){
  obstacle=createSprite(0,600,10,10);
  //obstacle.debug=true
  obstacle.velocityX=6;
 // obstacle.addImage(trainimage);
  var rand=Math.round(random(1,2))
  //console.log(rand);
switch(rand){
  case 1:obstacle.addImage(trainimage);
  obstacle.scale=1;
 obstacle.setCollider("rectangle",0,0,obstacle.width,80);

  invisibleSprite=createSprite(0,550,obstacle.width-70,10);
  invisibleSprite.visible=false;
  console.log(obstacle.height);
  invisibleSprite.x=obstacle.x
  invisibleSprite.velocityX=6;
  isGroup.add(invisibleSprite);

  break;
  case 2:obstacle.addImage(electricpoleimage);
  obstacle.scale=0.3;
  obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height);
  break;
  default : break;
}
obstacleGroup.add(obstacle);

}
}
function fetchmoney(data){
dollars=data.val();

}

function showerror(){
  console.log("error in reading the databse");


}

function updatemoney(d){
  database.ref('/').update({
    money:d

  });
}













