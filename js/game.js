const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('playerTurn');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const winnerMsg = document.getElementById('winnerMsg');
const winnerSymbolDisplay = document.getElementById('winnerSymbol');
const resetBtn = document.getElementById('resetBtn');

// Modal Elements
const nameModal = new bootstrap.Modal(document.getElementById('nameModal'));
const startGameBtn = document.getElementById('startGameBtn');
const p1Input = document.getElementById('p1Name');
const p2Input = document.getElementById('p2Name');

let currentPlayer = 'X';
let playerNames = { X: "Player 1", O: "Player 2" };
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false; // Start inactive until names are entered

// Show modal on load
window.addEventListener('load', () => {
    nameModal.show();
});

startGameBtn.addEventListener('click', () => {
    playerNames.X = p1Input.value.trim() || "Player 1";
    playerNames.O = p2Input.value.trim() || "Player 2";
    currentPlayerDisplay.innerText = playerNames.X;
    gameActive = true;
    nameModal.hide();
});

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        announce(playerNames[currentPlayer]);
        saveGameRecord(currentPlayer);
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        announce('Draw');
        saveGameRecord('Draw');
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    currentPlayerDisplay.innerText = playerNames[currentPlayer];
}

function announce(winner) {
    statusDisplay.style.display = 'none';
    winnerMsg.style.display = 'block';
    winnerSymbolDisplay.innerText = winner === 'Draw' ? "It's a Draw" : winner;

    if (winner !== 'Draw' && winner !== 'It\'s a Draw') {
        const symbol = winner === playerNames.X ? 'X' : 'O';
        cells.forEach(cell => {
            if (cell.innerText === symbol) {
                cell.style.background = 'rgba(233, 69, 96, 0.2)';
            }
        });
    }
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.style.display = 'block';
    winnerMsg.style.display = 'none';
    currentPlayerDisplay.innerText = playerNames.X;
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o');
        cell.style.background = 'rgba(255, 255, 255, 0.03)';
    });
}

function saveGameRecord(result) {
    const records = JSON.parse(localStorage.getItem('ticTacToeRecords')) || [];
    const newRecord = {
        date: new Date().toLocaleString(),
        p1: playerNames.X,
        p2: playerNames.O,
        winner: result === 'Draw' ? 'Draw' : playerNames[result],
        winnerSymbol: result
    };
    records.unshift(newRecord);
    localStorage.setItem('ticTacToeRecords', JSON.stringify(records.slice(0, 50)));
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', handleRestartGame);
