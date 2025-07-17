const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameStatusElement = document.getElementById('gameStatus');

// Speed control elements
const slowBtn = document.getElementById('slowBtn');
const normalBtn = document.getElementById('normalBtn');
const fastBtn = document.getElementById('fastBtn');

const gridSize = 20;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;

// Speed settings
const speeds = {
    slow: 200,
    normal: 100,
    fast: 50
};
let currentSpeed = 'normal';

function randomTileX() {
    return Math.floor(Math.random() * tileCountX);
}

function randomTileY() {
    return Math.floor(Math.random() * tileCountY);
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: randomTileX(),
            y: randomTileY()
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    food = newFood;
}

function drawGame() {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#001122');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake with gradient
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Snake head
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
            // Add eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + 4, 3, 3);
            ctx.fillRect(segment.x * gridSize + 13, segment.y * gridSize + 4, 3, 3);
        } else {
            // Snake body
            const alpha = Math.max(0.3, 1 - (index * 0.05));
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        }
    });
    
    // Draw food with pulsing effect
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
    ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);
    
    // Add food highlight
    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.fillRect(food.x * gridSize + 6, food.y * gridSize + 6, 8, 8);
}

function moveSnake() {
    if (dx === 0 && dy === 0) return;
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        gameStatusElement.textContent = '🍎 Yummy! +10 points';
        setTimeout(() => gameStatusElement.textContent = '', 1000);
    } else {
        snake.pop();
    }
}

function gameOver() {
    clearInterval(gameInterval);
    gameStatusElement.textContent = '💀 Game Over! Restarting in 2 seconds...';
    setTimeout(resetGame, 2000);
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameStatusElement.textContent = '🎮 Use arrow keys to start!';
    generateFood();
    startGameLoop();
}

function startGameLoop() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        moveSnake();
        drawGame();
    }, speeds[currentSpeed]);
}

function setSpeed(speed) {
    currentSpeed = speed;
    updateSpeedButtons();
    startGameLoop();
    gameStatusElement.textContent = `⚡ Speed set to ${speed}`;
    setTimeout(() => {
        if (gameStatusElement.textContent.includes('Speed set')) {
            gameStatusElement.textContent = '';
        }
    }, 1000);
}

function updateSpeedButtons() {
    [slowBtn, normalBtn, fastBtn].forEach(btn => btn.classList.remove('active'));
    
    slowBtn.style.background = currentSpeed === 'slow' ? '#45a049' : '#4CAF50';
    normalBtn.style.background = currentSpeed === 'normal' ? '#45a049' : '#4CAF50';
    fastBtn.style.background = currentSpeed === 'fast' ? '#45a049' : '#4CAF50';
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && dy !== 1) {
        dx = 0;
        dy = -1;
        if (gameStatusElement.textContent.includes('Use arrow keys')) {
            gameStatusElement.textContent = '';
        }
    } else if (e.key === 'ArrowDown' && dy !== -1) {
        dx = 0;
        dy = 1;
        if (gameStatusElement.textContent.includes('Use arrow keys')) {
            gameStatusElement.textContent = '';
        }
    } else if (e.key === 'ArrowLeft' && dx !== 1) {
        dx = -1;
        dy = 0;
        if (gameStatusElement.textContent.includes('Use arrow keys')) {
            gameStatusElement.textContent = '';
        }
    } else if (e.key === 'ArrowRight' && dx !== -1) {
        dx = 1;
        dy = 0;
        if (gameStatusElement.textContent.includes('Use arrow keys')) {
            gameStatusElement.textContent = '';
        }
    }
});

// Speed control buttons
slowBtn.addEventListener('click', () => setSpeed('slow'));
normalBtn.addEventListener('click', () => setSpeed('normal'));
fastBtn.addEventListener('click', () => setSpeed('fast'));

// Initialize game
generateFood();
drawGame();
updateSpeedButtons();
gameStatusElement.textContent = '🎮 Use arrow keys to start!';
startGameLoop();
