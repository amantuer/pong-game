export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem
    this.reset()
  }

  get position(){
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue('--position'))
  }
  
  set position(value){
    this.paddleElem.style.setProperty('--position', value)
  }

  rect() {
     return this.paddleElem.getBoundingClientRect()
  }

  reset(){
    this.position = 50
  }
  // In order to not end up computer wins everytime we need to set a max speed for computer
  update(delta, ballHeight, SPEED) {
    this.position += SPEED * delta * (ballHeight - this.position)
    // this caluation is accurately really smart, when the distance between ball and computer gets big, computer speed will get big
  }
}