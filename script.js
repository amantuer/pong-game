import Ball from "./Ball.js";
import Paddle from './Paddle.js'
// get the ball element in html and create a instance of class for that ball
const ball = new Ball(document.getElementById('ball'))
const playerPaddle = new Paddle(document.getElementById('player-paddle'))
const computerPaddle = new Paddle(document.getElementById('computer-paddle'))
const playerScoreElem = document.getElementById('player-score')
const computerScoreElem = document.getElementById('computer-score')

const EASY_M = 0.002
const NORMAL_M = 0.02
const HARD_M = 0.06
let SPEED = 0.02

let lastTime
let isPaused = false
let stateStore = {
  delta : 0,
  lastTime : 0,
  paddles : 0 ,
  playerScoreElem : {
    textContent: 0,
  },
  computerScoreElem : {
    textContent : 0,
  },
  playerPaddle : {
    position : 0
  },
  computerPaddle : {
    position : 0,
  },
  ball : {
     x : 0,
     y : 0,
     direction : 0,
     velocity : 0,
  }
}
//passing time argument as how much time passed since program start
function update(time) {
  if(lastTime != null) {
   const delta = time - stateStore.lastTime
   // after pause recover: delta = 0.000000001 * time // or something like that 
   stateStore.delta = delta
   stateStore.paddles = [playerPaddle.rect(),computerPaddle.rect()]
   
   if(!isPaused){
     ball.update(stateStore.delta, stateStore.paddles)
   }else{
     // set point and ball paddles position
     // score
     playerScoreElem.textContent = stateStore.playerScoreElem.textContent
     computerScoreElem.textContent = stateStore.computerScoreElem.textContent
     // paddle
     playerPaddle.position = stateStore.playerPaddle.position 
     computerPaddle.position = stateStore.computerPaddle.position
     //ball
     ball.x = stateStore.ball.x
     ball.y = stateStore.ball.y
     ball.direction = stateStore.ball.direction
     ball.velocity = stateStore.ball.velocity
   }

   computerPaddle.update(delta, ball.y, SPEED)
   stateStore.computerPaddle.position = computerPaddle.position

   const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hue'))
   document.documentElement.style.setProperty('--hue', hue + delta * .01)

   if(isLose()) handleLoseAndPause(isPaused)
  }
  lastTime = time
  stateStore.lastTime = lastTime

  window.requestAnimationFrame(update)
}

function isLose(){
   const rect = ball.rect()
   stateStore.ball.x = ball.x
   stateStore.ball.y = ball.y
   stateStore.ball.direction = ball.direction
   stateStore.ball.velocity = ball.velocity
   return rect.right >= window.innerWidth || rect.left <= 0
}

function handleLoseAndPause() {
  const rect = ball.rect()
  if(rect.right >= window.innerWidth){
    playerScoreElem.textContent = parseInt(stateStore.playerScoreElem.textContent) + 1
    stateStore.playerScoreElem.textContent = playerScoreElem.textContent
  }else {
    computerScoreElem.textContent = parseInt(stateStore.computerScoreElem.textContent) + 1
    stateStore.computerScoreElem.textContent = computerScoreElem.textContent
  }
  ball.reset()
  computerPaddle.reset()
}

// convert pixels value to vh get result of 0 ~ 100
function movePaddle(e){
   if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel'){
      if(document.body.classList.contains('hasHover'))
      {
         document.body.classList.remove('hasHover')
      }     
   }else {
      if(!document.body.classList.contains('hasHover'))
      {
         document.body.classList.add('hasHover')
      }            
   } 
  e.preventDefault()
  if(!isPaused)playerPaddle.position = (e.y / window.innerHeight) * 100
  if(!isPaused)stateStore.playerPaddle.position = playerPaddle.position
}
document.addEventListener('mousemove', movePaddle)
document.addEventListener('touchmove', movePaddle)

// add event listener to handle game pause
const pauseButton = document.getElementById('pause');
function handlePause(e){
   if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel'){
      if(document.body.classList.contains('hasHover'))
      {
         document.body.classList.remove('hasHover')
      }     
   }else {
      if(!document.body.classList.contains('hasHover'))
      {
         document.body.classList.add('hasHover')
      }            
   } 
   e.preventDefault()
   isPaused = !isPaused 
}
pauseButton.addEventListener('click', handlePause)
pauseButton.addEventListener('touchstart', handlePause)

// We need to add touchend handle on 
// We don't need hover event on mobile read mdn read code change css when touchstirt
const restartButton = document.getElementById('restart');
function handleRestart(e){
   if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel'){
      if(document.body.classList.contains('hasHover'))
      {
         document.body.classList.remove('hasHover')
      }     
   }else {
      if(!document.body.classList.contains('hasHover'))
      {
         document.body.classList.add('hasHover')
      }            
   } 
   e.preventDefault()
   window.location = window.location.hash
}
restartButton.addEventListener('click', handleRestart)
restartButton.addEventListener('touchend', handleRestart)

// add event listener to speed change butto
const buttons = document.getElementsByClassName('Normal');
function handleHardMenu(e){
   if(e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel'){
      if(document.body.classList.contains('hasHover'))
      {
         document.body.classList.remove('hasHover')
      }     
   }else {
      if(!document.body.classList.contains('hasHover'))
      {
         document.body.classList.add('hasHover')
      }            
   } 
    e.preventDefault()
    Array.from(buttons).forEach((button) => {
       if(button.classList.contains('active')){
         button.classList.remove('active')       
       }
    }) 
    e.target.classList.add('active')
    switch(e.target.id){
      case 'easy':  SPEED = EASY_M;
        break;
      case 'normal': SPEED = NORMAL_M;    
        break;
      case 'hard': SPEED = HARD_M;  
        break;  
    }
}
Array.from(buttons).forEach(button => button.addEventListener('click', handleHardMenu));
Array.from(buttons).forEach(button => button.addEventListener('touchend', handleHardMenu));

window.requestAnimationFrame(update)

/*
1. 
setInterval(,10) 
This is bad practive. Because setInterval is not super accurate. It's not gonna going to run every 10 milliseconds so you kind of have some problems there, And also it's going to run between frames. With request animation frame what happens is every time that you can change what's on the screen this function is going to be called so js is smart enough to say: you can't change anything on the screen so don't even bother running code but now as soon as you can run something on the screen it calls this function for us.
And as when keep calling window.requestAnimationFrame it's going to infinitely loop so right here we've created an infinite loop which is called updated every single time that something on our screen is allowed to change so every frame it's going to call this function for us and all we need to do is set this up and now we have that update loop 
*/

/*
2.
   This update function is a function we're going to create(inside Ball class) and we're passing in the delta into this function, the reason we're passing that delta in is because as you saw that delta fluctuated波动 somethimes somethime it was 6.9 millisecond sometimes it wa 7.1 millisecond it fluctuated a little bit. It's important to use that delta to make sure all of our movements in our game are based on that because if for example we have a frame drop and the time between frames is like 50 milliseconds 
   we want to make sure we take that into account when we're performing our 
   calculations 
*/
