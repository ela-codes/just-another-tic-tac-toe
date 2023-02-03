/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */


// assumptions:
// player 1 is always X
// player 2 is always O


const Player = (playerMarker) => ({marker: playerMarker, allMoves: []})

let board = [['A0', 'A1', 'A2'], ['B0', 'B1', 'B2'], ['C0', 'C1', 'C2']];
const p1 = Player('X');
const p2 = Player('O');

let winnerFound = false;
let moveCount = 0;
let player = p1;


function playGame(currPlayer, currSlot, gameBoard) {

    currPlayer.allMoves.push(currSlot)

    const updateBoard = (() => {
        for (const row of gameBoard) {
            if (row.includes(currSlot)) {
                row[currSlot.slice(1,2)] = String(currPlayer.marker)
            }
        }
    })();

    const showBoard = (() => {
        const currDomSlot = document.querySelector(`.${currSlot}`)
        currDomSlot.textContent = currPlayer.marker
        console.log(`Displayed ${currPlayer.marker} on slot ${currSlot}`)
    })();

    console.log(currPlayer.allMoves)

}

function checkForWin(currPlayer) {
   
    const winPatternChecker = (winArray, playerMoves) => {
        const checker = winArray.every(slot => playerMoves.includes(slot))
        return checker
    }

    let winStatus = false;
    const verticalWin = [['A0', 'A1', 'A2'], ['B0', 'B1', 'B2'], ['C0', 'C1', 'C2']];
    const horizontalWin = [['A0', 'B0', 'C0'], ['A1', 'B1', 'C1'], ['A2', 'B2', 'C2']];
    const diagonalWin = [['A0', 'B1', 'C2'], ['A2', 'B1', 'C0']];

    for (const combo of horizontalWin) {
        if (winPatternChecker(combo, currPlayer.allMoves)) {
            winStatus = true;
            console.log(`horizontal: matched  ${combo} with ${currPlayer.allMoves}`)
            return winStatus
        }
    }

    for (const combo of verticalWin) {
        if (winPatternChecker(combo, currPlayer.allMoves)) {
            winStatus = true;
            console.log(`vertical: matched  ${combo} with ${currPlayer.allMoves}`)
            return winStatus
        }
    }

    for (const combo of diagonalWin) {
        if (winPatternChecker(combo, currPlayer.allMoves)) {
            winStatus = true;
            console.log(`diagonal: matched  ${combo} with ${currPlayer.allMoves}`)
            return winStatus
        }   
    } return winStatus
}


function displayResult(winStatus, currPlayer, resultModal) {
    const msgDisplay = document.querySelector('.results-msg');

    resultModal.style.display = 'block';
        
    const announceWinner = () => {
        msgDisplay.innerHTML = `Player ${currPlayer.marker} wins!`
    }

    const announceTie = () => {
        msgDisplay.innerHTML = `It's a tie! Whew, that was close.`
    }

    winStatus === true ? announceWinner() :announceTie()
}

function resetGame(slots, resultModal) {
    winnerFound = false;
    moveCount = 0;
    player = p1;
    board = [['A0', 'A1', 'A2'], ['B0', 'B1', 'B2'], ['C0', 'C1', 'C2']]
    p1.allMoves = []
    p2.allMoves = []
    slots.forEach(slot => slot.innerHTML = '')

    if (resultModal.style.display === 'block') {
        resultModal.style.display = 'none';
    }
    waitForMove
}

const waitForMove = (() => {
    const slots = document.querySelectorAll('.slot');
    const restartBtn = document.querySelector('button.restart');
    const lastRestartBtn = document.querySelector('button.last')
    const pvpBtn = document.querySelector('button.PvP-btn');
    const gameModal = document.querySelector('.game-modal');
    const resultModal = document.querySelector('.results-modal');

    pvpBtn.onclick = (e) => {
        gameModal.style.display = 'none';
    }

    lastRestartBtn.onclick = () => {
        resetGame(slots, resultModal)
    }

    restartBtn.onclick = () => resetGame(slots, resultModal);

    slots.forEach(slot => slot.addEventListener('click', (e) => {

        const slotName = slot.classList[0]

        if (!slot.innerHTML && !winnerFound && moveCount < 9) {
            playGame(player, slotName, board)

            if (p1.allMoves.length >= 3 || p2.allMoves.length >= 3) {
                winnerFound = checkForWin(player)
            }
        }

        if (winnerFound || (!winnerFound && moveCount === 9)) {
            displayResult(winnerFound, player, resultModal)
        }

        player === p1 ? player = p2 : player = p1
        moveCount++
        waitForMove
    }))
})();




