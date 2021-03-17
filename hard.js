
let Board;
const USER = 'x';
const AI = '0';

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
];


/**
 *There is a bug in this code on changing background color 
 * I haven't figured out it yet
 * Minmax algorithm is working fine
 */

const cell = document.getElementsByClassName('box');
StartGame();

function StartGame() {
  document.querySelector('.end-game').style.display = 'none';
  Board = Array.from(Array(9).keys());
  for (let i = 0; i < cell.length; i++) {
    cell[i].innerText = '';
    cell[i].style.removeProperty('background-color');
    cell[i].addEventListener('click', onTurnClick, false)
  }
};

function onTurnClick(e) {
  const { id: squareId } = e.target;
  if (typeof Board[squareId] === 'number') {
    onTurn(squareId, USER);
    if (!onCheckGameTie()) {
      onTurn(botPicksSpot(), AI)
    }
  } else {
    alert(`olace already occupied`);
  }
}

function onTurn(squareId, player) {
  Board[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let isGameWon = onCheckWin(Board, player);
  if (isGameWon) {
    onGameOver(isGameWon);
  }
}

function onCheckWin(board, player) {
  let plays = board.reduce((a, e, i) => {
    return (e === player) ? a.concat(i) : a;
  }, []);
  let gameWon = false;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

function onGameOver({ index, player }) {
  for (let i of winCombos[index]) {
    const color =  (player === USER) ? '#2196f3' : '#f44336';
    document.getElementById(i).style.backgroundColor = color;
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', onTurnClick, false)
  }

  const result = (player === USER) ? 'You Win' : 'You Lose';
  onDeclareWinner(result);
}

function onDeclareWinner(x) {
  document.querySelector('.end-game').style.display = 'block';
  document.querySelector('.end-game .text').innerText = `Result: ${x}`;
}


function onCheckGameTie() {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'brown';
      cells[i].removeEventListener('click', onTurnClick, false)
    }
    onDeclareWinner('A Tie');
    return true;
  } else {
    return false;
  }
}

function StartGame() {
  document.querySelector('.end-game').style.display = 'none';
  Board = Array.from(Array(9).keys());
  for (let i = 0; i < cell.length; i++) {
    cell[i].innerText = '';
    cell[i].style.removeProperty('background-color');
    cell[i].addEventListener('click', onTurnClick, false)
  }
};
function emptySquares() {
  return Board.filter(item => typeof item === 'number');
}

function botPicksSpot() {
  return minimax(Board, AI).index;
}

function minimax(newBoard, player) {
  let availableSpots = emptySquares();

  if (onCheckWin(newBoard, USER)) {
    return { score: -10 }
  } else if (onCheckWin(newBoard, AI)) {
    return { score: 10 }
  } else if (availableSpots.length === 0) {
    return { score: 0 }
  }

  let moves = [];

  for (let i=0; i<availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === AI) {
      let result = minimax(newBoard, USER);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, AI);
      move.score = result.score;
    } 

    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  } 

  let bestMove;

  if (player === AI) {
    let bestScore = -10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    } 
  } 
  else {
    let bestScore = 10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
} 