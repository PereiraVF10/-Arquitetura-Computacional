const wordsData = [
    // Horizontais (ordenadas em ordem crescente de ID)
    { id: 1, term: "CPU", word: "CPU", row: 2, col: 2, dir: "H", clue: "Cérebro principal responsável por coordenar e executar instruções." },
    { id: 5, term: "RAM", word: "RAM", row: 8, col: 2, dir: "H", clue: "Memória de acesso aleatório principal e volátil." },
    { id: 6, term: "ROM", word: "ROM", row: 10, col: 2, dir: "H", clue: "Memória apenas de leitura para inicialização do sistema." },
    { id: 7, term: "EEPROM", word: "EEPROM", row: 12, col: 2, dir: "H", clue: "Memória flash programável eletricamente e apagável." },
    { id: 8, term: "Flash", word: "FLASH", row: 14, col: 2, dir: "H", clue: "Tecnologia de armazenamento baseada em estado sólido rápida." },
    { id: 9, term: "cache", word: "CACHE", row: 2, col: 10, dir: "H", clue: "Memória de altíssima velocidade próxima aos núcleos." },
    { id: 11, term: "DMA", word: "DMA", row: 6, col: 8, dir: "H", clue: "Permite transferência direta de dados sem uso intensivo da CPU." },
    { id: 13, term: "data bus", word: "DATABUS", row: 8, col: 10, dir: "H", clue: "Barramento responsável pelo transporte real dos dados." },
    { id: 14, term: "microcontrolador", word: "MICROCONTROLADOR", row: 17, col: 1, dir: "H", clue: "Sistema computacional completo integrado em um único chip." },
    { id: 15, term: "dual core", word: "DUALCORE", row: 10, col: 8, dir: "H", clue: "Processador equipado com dois núcleos físicos independentes." },
    { id: 16, term: "quad core", word: "QUADCORE", row: 12, col: 8, dir: "H", clue: "Processador que possui quatro núcleos de processamento simultâneo." },

    // Verticais (ordenadas em ordem crescente de ID)
    { id: 2, term: "ULA", word: "ULA", row: 3, col: 2, dir: "V", clue: "Parte que faz contas e operações lógicas." },
    { id: 3, term: "UC (Unidade de Controle)", word: "UC", row: 5, col: 6, dir: "V", clue: "Gerencia e direciona as operações do sistema." },
    { id: 4, term: "registradores", word: "REGISTRADORES", row: 2, col: 6, dir: "V", clue: "Pequenos espaços de armazenamento ultrarrápidos internos." },
    { id: 10, term: "memória de massa", word: "MEMORIADEMASSA", row: 2, col: 14, dir: "V", clue: "Dispositivos de armazenamento não volátil de grande capacidade." },
    { id: 12, term: "address bus", word: "ADDRESSBUS", row: 6, col: 12, dir: "V", clue: "Barramento que define as posições de memória acessadas." }
];

const boardSize = 19;
const boardElement = document.getElementById("crossword-board");
const btnCheck = document.getElementById("btn-check");
const btnReset = document.getElementById("btn-reset");
const scoreDisplay = document.getElementById("score-display");
const horizontalCluesList = document.getElementById("horizontal-clues");
const verticalCluesList = document.getElementById("vertical-clues");

function renderClues() {
    horizontalCluesList.innerHTML = "";
    verticalCluesList.innerHTML = "";

    // Ordena as listas de dicas de forma estritamente crescente pelo ID
    const horizontais = wordsData.filter(item => item.dir === "H").sort((a, b) => a.id - b.id);
    const verticais = wordsData.filter(item => item.dir === "V").sort((a, b) => a.id - b.id);

    horizontais.forEach(item => {
        const li = document.createElement("li");
        li.id = `clue-${item.id}`;
        li.innerHTML = `<b>${item.id}.</b> ${item.clue} <span class="revealed-answer" style="display:none;">- ${item.term}</span>`;
        horizontalCluesList.appendChild(li);
    });

    verticais.forEach(item => {
        const li = document.createElement("li");
        li.id = `clue-${item.id}`;
        li.innerHTML = `<b>${item.id}.</b> ${item.clue} <span class="revealed-answer" style="display:none;">- ${item.term}</span>`;
        verticalCluesList.appendChild(li);
    });
}

function createBoard() {
    boardElement.innerHTML = "";
    
    const activeCells = {};
    const cellNumbers = {};

    wordsData.forEach(item => {
        let r = item.row;
        let c = item.col;
        
        if (!cellNumbers[`${r}-${c}`]) {
            cellNumbers[`${r}-${c}`] = item.id;
        }

        for (let i = 0; i < item.word.length; i++) {
            activeCells[`${r}-${c}`] = true;
            if (item.dir === "H") c++;
            else r++;
        }
    });

    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;

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

                input.addEventListener("input", (e) => {
                    const val = e.target.value;
                    if (val.length === 1) {
                        const nextInput = document.querySelector(`input[data-row='${r}'][data-col='${c + 1}']`) ||
                                          document.querySelector(`input[data-row='${r + 1}'][data-col='${c}']`);
                        if (nextInput && !nextInput.classList.contains("blocked") && !nextInput.disabled) {
                            nextInput.focus();
                        }
                    }
                });

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Backspace" && input.value === "") {
                        const prevInput = document.querySelector(`input[data-row='${r}'][data-col='${c - 1}']`) ||
                                          document.querySelector(`input[data-row='${r - 1}'][data-col='${c}']`);
                        if (prevInput && !prevInput.classList.contains("blocked") && !prevInput.disabled) {
                            prevInput.focus();
                            prevInput.value = "";
                            e.preventDefault();
                        }
                    } else if (e.key === "ArrowRight") {
                        const target = document.querySelector(`input[data-row='${r}'][data-col='${c + 1}']`);
                        if (target && !target.classList.contains("blocked")) target.focus();
                    } else if (e.key === "ArrowLeft") {
                        const target = document.querySelector(`input[data-row='${r}'][data-col='${c - 1}']`);
                        if (target && !target.classList.contains("blocked")) target.focus();
                    } else if (e.key === "ArrowDown") {
                        const target = document.querySelector(`input[data-row='${r + 1}'][data-col='${c}']`);
                        if (target && !target.classList.contains("blocked")) target.focus();
                    } else if (e.key === "ArrowUp") {
                        const target = document.querySelector(`input[data-row='${r - 1}'][data-col='${c}']`);
                        if (target && !target.classList.contains("blocked")) target.focus();
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
            if (clueElement) clueElement.style.display = "inline";
            cellsInWord.forEach(itemCell => {
                itemCell.input.disabled = true;
                itemCell.input.classList.add("correct");
                itemCell.input.classList.remove("incorrect");
            });
        } else {
            if (clueElement) clueElement.style.display = "none";
            cellsInWord.forEach(itemCell => {
                const charEntered = itemCell.input.value.toUpperCase();
                itemCell.input.classList.remove("correct", "incorrect");
                if (charEntered !== "") {
                    if (charEntered === itemCell.expectedChar) {
                        itemCell.input.classList.add("correct");
                    } else {
                        itemCell.input.classList.add("incorrect");
                    }
                }
            });
        }
    });

    scoreDisplay.textContent = `${correctWordsCount} de ${wordsData.length} palavras corretas.`;
}

function resetBoard() {
    const inputs = document.querySelectorAll(".cell:not(.blocked)");
    inputs.forEach(input => {
        input.value = "";
        input.disabled = false;
        input.classList.remove("correct", "incorrect");
    });
    document.querySelectorAll(".revealed-answer").forEach(span => span.style.display = "none");
    scoreDisplay.textContent = "0 de 16 palavras corretas.";
}

btnCheck.addEventListener("click", checkAnswers);
btnReset.addEventListener("click", resetBoard);

renderClues();
createBoard();