// Modify your existing JavaScript
const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const statusDiv = document.querySelector('.status');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scores = { X: 0, O: 0 };
let winningCombo = null; // Track winning combination

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    checkForWinner();
    if (gameActive) makeAIMove();
}

function checkForWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            winningCombo = winningConditions[i]; // Store winning combo
            highlightWinningCombo();
            scores[currentPlayer]++;
            statusDiv.textContent = `Player ${currentPlayer} wins! (X: ${scores.X} | O: ${scores.O})`;
            gameActive = false;
            return;
        }
    }

    if (!gameState.includes('')) {
        statusDiv.textContent = `Draw! (X: ${scores.X} | O: ${scores.O})`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.textContent = `It's ${currentPlayer}'s turn (X: ${scores.X} | O: ${scores.O})`;
}

function highlightWinningCombo() {
    if (!winningCombo) return;
    winningCombo.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('winning-combo');
        cell.classList.add('winning-cell');
    });
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    winningCombo = null;
    statusDiv.textContent = `It's ${currentPlayer}'s turn (X: ${scores.X} | O: ${scores.O})`;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'winning-combo', 'winning-cell');
    });
}

// AI Function remains the same
function makeAIMove() {
    if (currentPlayer === 'O' && gameActive) {
        const emptyCells = gameState
            .map((cell, index) => cell === '' ? index : null)
            .filter(val => val !== null);
        
        if (emptyCells.length > 0) {
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const aiChoice = emptyCells[randomIndex];
                gameState[aiChoice] = 'O';
                document.querySelector(`[data-index="${aiChoice}"]`).classList.add('o');
                checkForWinner();
            }, 500);
        }
    }
}

// Initialize
statusDiv.textContent = `It's ${currentPlayer}'s turn (X: ${scores.X} | O: ${scores.O})`;
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);