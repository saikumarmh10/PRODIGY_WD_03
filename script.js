const gameManager = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let isGameActive = true;
    let vsAI = false;

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const statusText = document.getElementById('statusText');
    const cells = document.querySelectorAll('.cell');
    const overlay = document.getElementById('overlay');
    const winMessage = document.getElementById('winMessage');

    const handleCellClick = (e) => {
        const index = e.target.getAttribute('data-index');
        if (board[index] !== "" || !isGameActive) return;

        makeMove(index, currentPlayer);
        
        if (checkWin(board, currentPlayer)) {
            endGame(`${currentPlayer} Wins!`);
        } else if (board.every(cell => cell !== "")) {
            endGame("It's a Draw!");
        } else {
            switchPlayer();
            if (vsAI && isGameActive && currentPlayer === "O") {
                setTimeout(aiMove, 500);
            }
        }
    };

    const makeMove = (index, player) => {
        board[index] = player;
        cells[index].innerText = player;
        cells[index].classList.add(player.toLowerCase());
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Player ${currentPlayer}'s Turn`;
    };

    const checkWin = (currentBoard, player) => {
        return winConditions.some(condition => {
            return condition.every(index => currentBoard[index] === player);
        });
    };

    const aiMove = () => {
        // Basic Logic: Choose first available spot
        // Can be upgraded to Minimax for "Expert" difficulty
        const availableMoves = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        
        if (randomMove !== undefined) {
            makeMove(randomMove, "O");
            if (checkWin(board, "O")) {
                endGame("AI Wins!");
            } else if (board.every(cell => cell !== "")) {
                endGame("It's a Draw!");
            } else {
                switchPlayer();
            }
        }
    };

    const endGame = (msg) => {
        isGameActive = false;
        winMessage.innerText = msg;
        overlay.classList.add('active');
    };

    const restart = () => {
        board = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        statusText.innerText = "Player X's Turn";
        overlay.classList.remove('active');
        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove('x', 'o');
        });
    };

    // Mode Selection Logic
    document.getElementById('pvpMode').addEventListener('click', (e) => {
        vsAI = false;
        restart();
        e.target.classList.add('active');
        document.getElementById('pvcMode').classList.remove('active');
    });

    document.getElementById('pvcMode').addEventListener('click', (e) => {
        vsAI = true;
        restart();
        e.target.classList.add('active');
        document.getElementById('pvpMode').classList.remove('active');
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('restartBtn').addEventListener('click', restart);

    return { restart };
})();