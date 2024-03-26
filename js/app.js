import elements from './elements.js';
import Player from './player.js';

const {
  playerElement,
  boardElement,
  scoreElement,
  lifesElemeent,
  endGameElement,
  startAgainButton,
  startButton,
  newGameElement,
} = elements;

const bullets = [];
const enemies = [];

const player = new Player({
  element: playerElement,
  boardElement: boardElement,
});

const creatBullet = () => {
  // zdefiniuj pocisk
  const bullet = document.createElement('div');
  bullet.className = 'bullet';
  bullet.style.left = `${playerElement.offsetLeft}px`;
  bullet.style.top = `${playerElement.offsetTop}px`;

  // dodaj na plansze
  boardElement.appendChild(bullet);
  bullets.push(bullet);
}

const handleKeyboard = (e) => {
  switch (e.code) {
    case 'ArrowLeft': player.moveX(-1); break;
    case 'ArrowRight': player.moveX(1); break;
    case 'ArrowUp': player.moveY(-1); break;
    case 'ArrowDown': player.moveY(1); break;
    case 'Space': creatBullet();
  }
}

// obsłużenie klawiatury
window.addEventListener('keydown', handleKeyboard);

const checkCollision = (bullet, enemy) => {
  return (bullet.left > enemy.left && bullet.right < enemy.right)
    && (bullet.top < enemy.bottom);
}

const addScore = (points = 0) => {
  player.addScore(points);
  scoreElement.innerHTML = player.getScore();
}

const showLifes = () => {
  const html = Array(player.getLifes())
    .fill(0)
    .map(n => '<div class="life"></div>')
    .join('');

  lifesElemeent.innerHTML = html;
}

const checkBulletCollision = (bullet) => {
  const position = bullet.getBoundingClientRect();

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyPostion = enemy.getBoundingClientRect();

    // czy pocisk i statek znajdują się w tym samym miejscu
    if (checkCollision(position, enemyPostion)) {
      // dodaj punkty
      addScore(1);

      // usuń pocisk
      const idx = bullets.indexOf(bullet);
      bullets.splice(idx, 1);
      bullet.remove();

      // dodaj wybuch
      makeExplosion(enemy.offsetLeft, enemy.offsetTop);

      // usuń trafiony statek
      enemies.splice(i, 1);
      enemy.remove();

      break;
    }
  }
}

const makeExplosion = (left, top) => {
  // zdefiniuj wybuch
  const explosion = document.createElement('div');
  explosion.className = 'explosion';
  explosion.style.left = `${left}px`;
  explosion.style.top = `${top}px`;

  // dodaj wybuch na mapie
  boardElement.appendChild(explosion);

  // usun wybuch po 2 sek
  setTimeout(() => {
    explosion.remove();
  }, 2000);
}

const moveBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    // przesuń pocisk
    bullet.style.top = `${bullet.offsetTop - 10}px`;

    if (bullet.offsetTop <= 0) {
      // usuń pocisk jeśli jest za mapą
      bullets.splice(i, 1);
      i--;
      bullet.remove();
    } else {
      // sprawdź czy coś trafił
      checkBulletCollision(bullet);
    }
  }
}

const createEnemy = () => {
  // tworz statki losowo (raz tak, raz nie)
  const shouldCreate = Math.round(Math.random());
  if (!shouldCreate) return;

  // zdefiniuj statek
  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.top = -40 + 'px';
  enemy.style.left = `${Math.floor(Math.random() * (boardElement.offsetWidth - 120) + 60)}px`;

  // dodaj do mapy
  boardElement.append(enemy);
  enemies.push(enemy);
}

const moveEnemies = () => {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    // przesuń statek w dół
    enemy.style.top = `${enemy.offsetTop + 5}px`;

    // gdy statek wyjedzie poza mapę
    if (enemy.offsetTop >= boardElement.offsetHeight) {
      // odejmij punkt życia
      player.setLifes(player.getLifes() - 1);
      showLifes();

      // usun wroga z mapy
      enemies.splice(i, 1);
      enemy.remove();

      // koniec gry
      if (player.getLifes() === 0) {
        gameOver();
      }
    }
  }
}

const startAgain = () => {
  window.location.reload();
}

// intervały
let moveEnemiesInterval
let createEnemiesInterval

const gameOver = () => {
  endGameElement.style.display = 'block';
  clearInterval(moveEnemiesInterval);
  clearInterval(createEnemiesInterval);
  boardElement.style.animation = 'none';
}

const startGame = () => {
  // dodaj animacje do tła
  boardElement.style.animation = 'moveBg 1.5s infinite linear';

  // start intervały
  setInterval(moveBullets, 50);
  moveEnemiesInterval = setInterval(moveEnemies, 200);
  createEnemiesInterval = setInterval(createEnemy, 1000);

  showLifes();

  // ukryj box
  newGameElement.style.display = 'none';
}


startAgainButton.addEventListener('click', startAgain);
startButton.addEventListener('click', startGame);