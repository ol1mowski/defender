export default class Player {
  constructor(settings) {
    this.lifes = settings.lifes || 3;
    this.score = 0;
    this.element = settings.element;
    this.boardElement = settings.boardElement;
  }

  getLifes() {
    return this.lifes;
  }

  setLifes(number) {
    this.lifes = number;
  }

  getScore() {
    return this.score;
  }

  setScore(score) {
    this.score = score;
  }

  addScore(score) {
    this.score += score;
  }

  moveX(direction) {
    // policz nową pozycje playera
    const newPosition = this.element.offsetLeft + direction * 10;
    // pobierz pozycję planszy
    const { left, right } = this.boardElement.getBoundingClientRect();
    const minLeft = this.element.offsetWidth / 2;
    const maxRight = right - left - minLeft;
  
    // przesuń playera jeśli mieści się w planszy
    if (newPosition >= minLeft && newPosition < maxRight) {
      this.element.style.left = `${newPosition}px`;
    }
  }

  moveY(direction) {
    // policz nową pozycje playera
    const newPosition = this.element.offsetTop + direction * 10;
    const minTop = 0;
    const maxTop = this.boardElement.offsetHeight - this.element.offsetHeight;
  
    // przesuń playera jeśli mieści się w planszy
    if (newPosition >= minTop && newPosition < maxTop) {
      this.element.style.top = `${newPosition}px`;
    }
  }
}