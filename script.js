const wordsData = [
    { id: 1, term: "CPU", word: "CPU", row: 1, col: 1, dir: "V", clue: "Cérebro principal responsável por coordenar e executar instruções." },
    { id: 2, term: "ULA", word: "ULA", row: 1, col: 1, dir: "H", clue: "Parte que realiza cálculos e operações lógicas." },
    { id: 3, term: "UC (Unidade de Controle)", word: "UC", row: 3, col: 1, dir: "H", clue: "Gerencia e direciona as operações do sistema." },
    { id: 4, term: "registradores", word: "REGISTRADORES", row: 1, col: 7, dir: "V", clue: "Pequenos espaços de armazenamento ultrarrápidos internos." },
    { id: 5, term: "RAM", word: "RAM", row: 5, col: 1, dir: "H", clue: "Memória de acesso aleatório principal e volátil." },
    { id: 6, term: "ROM", word: "ROM", row: 7, col: 1, dir: "H", clue: "Memória apenas de leitura para inicialização do sistema." },
    { id: 7, term: "EEPROM", word: "EEPROM", row: 9, col: 1, dir: "H", clue: "Memória flash programável eletricamente e apagável." },
    { id: 8, term: "Flash", word: "FLASH", row: 11, col: 1, dir: "H", clue: "Tecnologia de armazenamento baseada em estado sólido rápida." },
    { id: 9, term: "cache", word: "CACHE", row: 13, col: 1, dir: "H", clue: "Memória de altíssima velocidade próxima aos núcleos." },
    { id: 10, term: "memória de massa", word: "MEMORIADEMASSA", row: 1, col: 11, dir: "V", clue: "Dispositivos de armazenamento não volátil de grande capacidade." },
    { id: 11, term: "DMA", word: "DMA", row: 1, col: 4, dir: "V", clue: "Permite transferência direta de dados sem uso intensivo da CPU." },
    { id: 12, term: "address bus", word: "ADDRESSBUS", row: 1, col: 9, dir: "V", clue: "Barramento que define as posições de memória acessadas." },
    { id: 13, term: "data bus", word: "DATABUS", row: 3, col: 3, dir: "H", clue: "Barramento responsável pelo transporte real dos dados." },
    { id: 14, term: "microcontrolador", word: "MICROCONTROLADOR", row: 15, col: 1, dir: "H", clue: "Sistema computacional completo integrado em um único chip." },
    { id: 15, term: "dual core", word: "DUALCORE", row: 5, col: 3, dir: "H", clue: "Processador equipado com dois núcleos físicos independentes." },
    { id: 16, term: "quad core", word: "QUADCORE", row: 7, col: 3, dir: "H", clue: "Processador que possui quatro núcleos de processamento simultâneo." }
];

const boardSize = 15;
const boardElement = document.getElementById("crossword-board");
const btnCheck = document.getElementById("btn-check");
const btnReset = document.getElementById("btn-reset");
const scoreDisplay = document.getElementById("score-display");
const horizontalCluesList = document.getElementById("horizontal-clues");
const verticalCluesList = document.getElementById("vertical-clues");

function renderClues() {
    horizontalCluesList.innerHTML = "";
    verticalCluesList.innerHTML = "";

    wordsData.forEach(item => {
        const li = document.createElement("li");
        li.id = `clue-${item.id}`;
        li.innerHTML = `<b>${item.id}.</b> ${item.clue} (${item.word.length} letras) <span class="revealed-answer" style="display:none;">- ${item.term}</span>`;
        
        if (item.dir === "H") {
            horizontalCluesList.appendChild(li);
        } else {
            verticalCluesList.appendChild(li);
        }
    });
}

function createBoard() {
    boardElement.innerHTML = "";
    
    const activeCells = {};
    const cellNumbers = {};

    wordsData.forEach(item => {
        let r = item.row;
        let c = item.col;
        
        // Atribui o número da dica à primeira letra da palavra
        if (!cellNumbers[`${r}-${c}`]) {
            cellNumbers[`${r}-${c}`] = item.id;
        }

        for (let i = 0; i < item.word.length; i++) {
            activeCells[`${r}-${c}`] = true;
            if (item.dir === "H") c++;
            else r++;
        }
    });

    for (let r = 1; r <= boardSize; r++) {
        for (let c = 1; c <= boardSize; c++) {
            const key = `${r}-${c}`;
            const wrapper = document.createElement("div");
            wrapper.className = "cell-wrapper";

            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.dataset.row = r;
            input.dataset.col = c;
            
            if (activeCells[key]) {
                input.className = "cell";
                if (cellNumbers[key]) {
                    const numSpan = document.createElement("span");
                    numSpan.className = "cell-number";
                    numSpan.textContent = cellNumbers[key];
                    wrapper.appendChild(numSpan);
                }

                // Navegação automática para a próxima célula
                input.addEventListener("input", (e) => {
                    if (e.target.value.length === 1) {
                        const nextCol = c < boardSize ? c + 1 : c;
                        const nextInput = document.querySelector(`input[data-row='${r}'][data-col='${nextCol}']`);
                        if (nextInput && !nextInput.classList.contains("blocked")) {
                            nextInput.focus();
                        }
                    }
                });
            } else {
                input.className = "cell blocked";
                input.disabled = true;
            }

            wrapper.appendChild(input);
            boardElement.appendChild(wrapper);
        }
    }
}

// Validação letra por letra e revelação das respostas nas dicas ao acertar
function checkAnswers() {
    let correctWordsCount = 0;

    wordsData.forEach(item => {
        let r = item.row;
        let c = item.col;
        let userWord = "";
        let cellsInWord = [];

        for (let i = 0; i < item.word.length; i++) {
            const input = document.querySelector(`input[data-row='${r}'][data-col='${c}']`);
            if (input) {
                userWord += (input.value || "").toUpperCase();
                cellsInWord.push({ input, expectedChar: item.word[i] });
            }
            if (item.dir === "H") c++;
            else r++;
        }

        const isWordCorrect = (userWord === item.word);
        const clueElement = document.querySelector(`#clue-${item.id} .revealed-answer`);

        if (isWordCorrect) {
            correctWordsCount++;
            if (clueElement) clueElement.style.display = "inline"; // Revela a resposta na dica apenas se acertar
        } else {
            if (clueElement) clueElement.style.display = "none";
        }

        cellsInWord.forEach(itemCell => {
            const charEntered = itemCell.input.value.toUpperCase();
            itemCell.input.classList.remove("correct", "incorrect");
            
            if (charEntered !== "") {
                if (charEntered === itemCell.expectedChar) {
                    itemCell.input.classList.add("correct"); // Verde no quadrado certo
                } else {
                    itemCell.input.classList.add("incorrect"); // Vermelho no quadrado errado
                }
            }
        });
    });

    scoreDisplay.textContent = `${correctWordsCount} de ${wordsData.length} palavras corretas.`;
}

function resetBoard() {
    const inputs = document.querySelectorAll(".cell:not(.blocked)");
    inputs.forEach(input => {
        input.value = "";
        input.classList.remove("correct", "incorrect");
    });
    document.querySelectorAll(".revealed-answer").forEach(span => span.style.display = "none");
    scoreDisplay.textContent = "";
}

btnCheck.addEventListener("click", checkAnswers);
btnReset.addEventListener("click", resetBoard);

renderClues();
createBoard();