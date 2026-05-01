const size = 10;
const minesCount = 10;

let field = [];
let timer = 0;
let interval;
let flags = minesCount;
let gameOver = false;

const gameEl = document.getElementById("game");
const timerEl = document.getElementById("timer");
const flagsEl = document.getElementById("flags");

document.getElementById("restartBtn").onclick = startGame;

function startGame() {
    clearInterval(interval);
    timer = 0;
    timerEl.textContent = timer;
    flags = minesCount;
    flagsEl.textContent = flags;
    gameOver = false;

    field = [];

    for (let y = 0; y < size; y++) {
        field[y] = [];
        for (let x = 0; x < size; x++) {
            field[y][x] = {
                mine: false,
                open: false,
                flagged: false,
                count: 0
            };
        }
    }

    // рандомные мины
    let placed = 0;
    while (placed < minesCount) {
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);

        if (!field[y][x].mine) {
            field[y][x].mine = true;
            placed++;
        }
    }

    countMines();
    render();

    interval = setInterval(() => {
        timer++;
        timerEl.textContent = timer;
    }, 1000);
}

function countMines() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (field[y][x].mine) continue;

            let count = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    let ny = y + dy;
                    let nx = x + dx;

                    if (field[ny] && field[ny][nx] && field[ny][nx].mine) {
                        count++;
                    }
                }
            }

            field[y][x].count = count;
        }
    }
}

function render() {
    gameEl.innerHTML = "";

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            const data = field[y][x];

            if (data.open) {
                cell.classList.add("open");
                if (data.mine) {
                    cell.classList.add("mine");
                } else if (data.count > 0) {
                    cell.textContent = data.count;
                }
            }

            if (data.flagged) {
                cell.classList.add("flag");
            }

            cell.oncontextmenu = (e) => {
                e.preventDefault();
                toggleFlag(x, y);
            };

            cell.onclick = () => openCell(x, y);

            gameEl.appendChild(cell);
        }
    }
}

function toggleFlag(x, y) {
    if (gameOver) return;

    let cell = field[y][x];

    if (!cell.open) {
        cell.flagged = !cell.flagged;
        flags += cell.flagged ? -1 : 1;
        flagsEl.textContent = flags;
    }

    render();
}

function openCell(x, y) {
    if (gameOver) return;

    let cell = field[y][x];

    if (cell.open || cell.flagged) return;

    cell.open = true;

    if (cell.mine) {
        gameOver = true;
        alert("Ви програли!");
        revealAll();
        return;
    }

    if (cell.count === 0) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                let ny = y + dy;
                let nx = x + dx;

                if (field[ny] && field[ny][nx]) {
                    openCell(nx, ny);
                }
            }
        }
    }

    checkWin();
    render();
}

function revealAll() {
    for (let row of field) {
        for (let cell of row) {
            cell.open = true;
        }
    }
    render();
}

function checkWin() {
    let closed = 0;

    for (let row of field) {
        for (let cell of row) {
            if (!cell.open && !cell.mine) {
                closed++;
            }
        }
    }

    if (closed === 0) {
        gameOver = true;
        alert("Ви виграли!");
    }
}

startGame();
