// Definição das palavras e posições simplificadas na matriz 13x13
const wordsData = [
    { id: 1, word: "ULA", row: 1, col: 1, dir: "H" },
    { id: 2, word: "CPU", row: 1, col: 1, dir: "V" },
    { id: 3, word: "RAM", row: 3, col: 1, dir: "H" },
    { id: 4, word: "ROM", row: 5, col: 1, dir: "H" },
    { id: 5, word: "CACHE", row: 7, col: 1, dir: "H" },
    { id: 6, word: "EEPROM", row: 9, col: 1, dir: "H" },
    { id: 7, word: "FLASH", row: 11, col: 1, dir: "H" },
    { id: 8, word: "DMA", row: 1, col: 5, dir: "V" },
    { id: 9, word: "DATABUS", row: 3, col: 3, dir: "H" },
    { id: 10, word: "DUALCORE", row: 5, col: 3, dir: "H" },
    { id: 11, word: "REGISTRADORES", row: 1, col: 7, dir: "V" },
    { id: 12, word: "ADDRESSBUS", row: 1, col: 9, dir: "V" }
];

const boardSize = 13;
const boardElement = document.getElementById("crossword-board");
const btnCheck = document.getElementById("btn-check");
const btnReset = document.getElementById("btn-reset");
const scoreDisplay = document.getElementById("score-display");

// Mapeia quais células ativas pertencem a cada palavra
function createBoard() {
    boardElement.innerHTML = "";
    
    // Cria matriz de controle de células válidas
    const activeCells = {};
    wordsData.forEach(item => {
        let r = item.row;
        let c = item.col;
        for (let i = 0; i < item.word.length; i++) {
            const key = `${r}-${c}`;
            activeCells[key] = true;
            if (item.dir === "H") c++;
            else r++;
        }
    });

    for (let r = 1; r <= boardSize; r++) {
        for (let c = 1; c <= boardSize; c++) {
            const key = `${r}-${c}`;
            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;
            
            if (activeCells[key]) {
                input.className = "cell";
            } else {
                input.className = "cell blocked";
                input.disabled = true;
            }
            boardElement.appendChild(input);
        }
    }
}

// Preenche o tabuleiro com as letras corretas para validação
function checkAnswers() {
    let correctCount = 0;
    
    wordsData.forEach(item => {
        let r = item.row;
        let c = item.col;
        let userWord = "";
        let cellsInWord = [];

        for (let i = 0; i < item.word.length; i++) {
            const input = document.querySelector(`input[data-row='${r}'][data-col='${c} ‘]`) || 
                          document.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
            if (input) {
                userWord += (input.value || "").toUpperCase();
                cellsInWord.push(input);
            }
            if (item.dir === "H") c++;
            else r++;
        }

        // Validação da palavra exata
        if (userWord === item.word) {
            correctCount++;
            cellsInWord.forEach(cell => {
                cell.classList.remove("incorrect");
                cell.classList.add("correct");
            });
        } else {
            cellsInWord.forEach(cell => {
                cell.classList.remove("correct");
                cell.classList.add("incorrect");
            });
        }
    });

    scoreDisplay.textContent = `${correctCount} de ${wordsData.length} palavras corretas.`;
}

function resetBoard() {
    const inputs = document.querySelectorAll(".cell:not(.blocked)");
    inputs.forEach(input => {
        input.value = "";
        input.classList.remove("correct", "incorrect");
    });
    scoreDisplay.textContent = "";
}

btnCheck.addEventListener("click", checkAnswers);
btnReset.addEventListener("click", resetBoard);

// Inicializa o tabuleiro ao carregar a página
createBoard();