result = document.getElementById("result");
point = document.getElementById("score");

let gameActive = true;
let computer = "X";
let human = "O";
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let score = 0

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

function handleRestartGame() {
    const elements = document.querySelectorAll('*');

    elements.forEach((element) => {
        element.classList.remove('x-color');
        element.classList.remove('o-color');
        element.classList.remove('noHover');

    });
    document.getElementById("end").style.display = "none";
    gameActive = true;
    currentPlayer = (currentPlayer == "X")? "O":"X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    if (currentPlayer == "X"){
        computer_move(computer);
    }
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
            break
        }
    }

    if (roundWon) {
        score += 1;
        result.innerHTML="You Lose:("
        gameActive = false;
        point.innerHTML= score;
        document.getElementById("end").style.display = "block";
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        result.innerHTML="Tied game!";
        document.getElementById("end").style.display = "block";
        gameActive = false;
        return;
    }

}

function is_win(letter) {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c && a == letter) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        return true;
    }
    else {
        return false;
    }

}



function inserted(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add("o-color");
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add("noHover");
    handleResultValidation();
    if (gameActive) {
        currentPlayer = "X";
        computer_move(computer);
    }


}

function insert_computer(letter, pos) {
    gameState[pos] = letter;
    const clickedCell = document.querySelector('[data-cell-index="' + pos + '"]');
    clickedCell.classList.add("x-color");
    clickedCell.innerHTML = letter;
    clickedCell.classList.add("noHover");
    handleResultValidation();
    if (gameActive) {
        currentPlayer = "O";
    }

}



function computer_move(letter) {
    let best_score = -100;
    let best_position = -1;

    for (let index = 0; index < gameState.length; index++) {

        if (gameState[index] == "" && gameActive) {
            gameState[index] = letter;
            let score = minmax(gameState, false);
            gameState[index] = "";
            if (score > best_score) {
                best_score = score;
                best_position = index;
            }
        }
    }
    insert_computer(letter, best_position);
    return;

}

function minmax(board, is_maximizing) {
    if (is_win(computer)) {
        return 10
    }
    else if (is_win(human)) {
        return -10
    } else if (!board.includes("") || !gameActive) {
        return 0
    }

    if (is_maximizing) { //Computer Turn
        let best_score = -100;
        for (let index = 0; index < board.length; index++) {
            if (board[index] == "" && gameActive) {
                board[index] = computer;
                let score = minmax(board, false);
                board[index] = "";
                best_score = Math.max(best_score, score);
            }
        }
        return best_score;
    } else { //Human Turn
        let best_score = 100;
        for (let index = 0; index < board.length; index++) {
            if (board[index] == "" && gameActive) {
                board[index] = human;
                let score = minmax(board, true);
                board[index] = "";
                best_score = Math.min(best_score, score);
            }
        }
        return best_score;
    }
}



computer_move(computer);

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', inserted));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);