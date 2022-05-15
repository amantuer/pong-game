import Ball from "./Ball.js";
import Paddle from './Paddle.js'

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

