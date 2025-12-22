let marathonMode = false;
let totalAccumulatedScore = 0;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('player') || 'Игрок';
    const startLevel = parseInt(urlParams.get('level')) || 1;
    const accumulatedScore = parseInt(urlParams.get('score')) || 0;
    const mode = urlParams.get('mode');

    marathonMode = (mode === 'marathon');
    totalAccumulatedScore = accumulatedScore;
    
    document.getElementById('player-name-display').textContent = playerName;
    document.getElementById('current-level').textContent = startLevel;
    
    document.getElementById('quit-btn').addEventListener('click', function() {
        if (confirm('Выйти к выбору уровня? Весь прогресс текущего уровня будет потерян.')) {
            window.location.href = 'level-select.html?player=' + encodeURIComponent(playerName);
        }
    });
    
    startGame(playerName, startLevel);
});

function startGame(playerName, level) {
    const urlParams = new URLSearchParams(window.location.search);
    const accumulatedScore = parseInt(urlParams.get('score')) || 0;

    let score = accumulatedScore;
    let timeLeft = Config.LEVELS[level].time;
    let currentQuestion = 0;
    let questions = [];
    let correctAnswers = [];
    let usedQuestionIds = [];
    
    const scoreElement = document.getElementById('current-score');
    const levelElement = document.getElementById('current-level');
    const timerElement = document.getElementById('timer');
    const gameArea = document.getElementById('game-area');
    
    scoreElement.textContent = score;
    levelElement.textContent = level;
    
    startTimer();
    
    loadQuestions(level);
    
    function startTimer() {
        const timer = setInterval(function() {
            timeLeft--;
            timerElement.textContent = Utils.formatTime(timeLeft);
            
            if (timeLeft <= 10) {
                timerElement.style.color = '#e74c3c';
                timerElement.style.fontWeight = 'bold';
            } 
            else {
                timerElement.style.color = '';
                timerElement.style.fontWeight = '';
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                endLevel(false, 'Время вышло!');
            }
        }, 1000);
        window.gameTimer = timer;
    }
    
    function loadQuestions(levelNum) {
        questions = [];
        usedQuestionIds = [];
        
        if (levelNum === 1) {
            const allQuestions = Words.level1;
            const neededQuestions = Config.LEVELS[levelNum].questions;
            
            const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
            
            questions = shuffledQuestions.slice(0, Math.min(neededQuestions, shuffledQuestions.length));
            
            if (questions.length < neededQuestions) {
                const additionalCount = neededQuestions - questions.length;
                for (let i = 0; i < additionalCount; i++) {
                    questions.push(allQuestions[i % allQuestions.length]);
                }
            }
        } 
        else if (levelNum === 2) {
            const allQuestions = Words.level2;
            const neededQuestions = Config.LEVELS[levelNum].questions;
            
            const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
            
            questions = shuffledQuestions.slice(0, Math.min(neededQuestions, shuffledQuestions.length));

            if (questions.length < neededQuestions) {
                const additionalCount = neededQuestions - questions.length;
                for (let i = 0; i < additionalCount; i++) {
                    questions.push(allQuestions[i % allQuestions.length]);
                }
            }
        }
        else if (levelNum === 3) {
            const allQuestions = Words.level3;
            const neededQuestions = Config.LEVELS[levelNum].questions;

            const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);

            questions = shuffledQuestions.slice(0, Math.min(neededQuestions, shuffledQuestions.length));

            if (questions.length < neededQuestions) {
                const additionalCount = neededQuestions - questions.length;
                for (let i = 0; i < additionalCount; i++) {
                    questions.push(allQuestions[i % allQuestions.length]);
                }
            }
        }
    
        correctAnswers = [];
        currentQuestion = 0;
        showQuestion();
    }
    
    
    function showQuestion() {
        if (currentQuestion >= questions.length) {
            endLevel(true, 'Уровень пройден!');
            return;
        }
        const question = questions[currentQuestion];
        correctAnswers[currentQuestion] = []; 

        Utils.clearElement(gameArea);

        if (level === 1) {
            createLevel1Interface(question);
        } 
        else if (level === 2) {
            createLevel2Interface(question);
        } 
        else if (level === 3) {
            createLevel3Interface(question);
        }

        updateQuestionCounter();
    }

    function updateQuestionCounter() {
        const counter = document.querySelector('.question-progress');
        if (counter) {
            counter.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}`;
        }
    }
    
    function endLevel(success, message) {
        if (window.gameTimer) {
            clearInterval(window.gameTimer);
        }
        
        if (success) {
            const timeBonus = Math.floor(timeLeft * Config.SCORE.timeBonus);
            score += timeBonus;
            scoreElement.textContent = score;
            
            Storage.savePlayerResult(playerName, score, level, marathonMode);

            showResultScreen(true, message, timeBonus);
        } 
        else {
            if (score > 0) {
                Storage.savePlayerResult(playerName, score, level, marathonMode);
            }
            showResultScreen(false, message, 0);
        }
    }
    
    function showResultScreen(success, message, bonus) {
        Utils.clearElement(gameArea);
        
        const resultScreen = Utils.createElement('div', 'result-screen');
        
        if (success) {
            const isMarathonFinish = (marathonMode && level === 3);
            
            if (isMarathonFinish) {
                resultScreen.innerHTML = `
                    <div style="text-align: center; padding: 30px;">
                        <h2 style="color: #FFD700; font-size: 40px; margin-bottom: 20px;">МАРАФОН ЗАВЕРШЕН!</h2>
                        
                        <div style="font-size: 60px; font-weight: bold; color: #2c3e50; margin: 30px 0;">${totalAccumulatedScore + bonus}  ОЧКОВ</div>
                    </div>
                `;
                const buttons = Utils.createElement('div', 'result-buttons');
                buttons.style.marginTop = '40px';
                
                const levelsBtn = Utils.createElement('button', ['btn', 'btn-primary'], '🏆 В рейтинг');
                levelsBtn.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
                levelsBtn.style.color = '#333';
                levelsBtn.style.fontWeight = 'bold';
                levelsBtn.addEventListener('click', function() {
                    window.location.href = `rating.html`;
                });
                
                const newMarathonBtn = Utils.createElement('button', ['btn', 'btn-secondary'], '↻ Новый марафон');
                newMarathonBtn.addEventListener('click', function() {
                    window.location.href = `game.html?player=${encodeURIComponent(playerName)}&level=1&mode=marathon`;
                });
                
                const menuBtn = Utils.createElement('button', ['btn', 'btn-secondary'], '← Выбор уровня');
                menuBtn.addEventListener('click', function() {
                    window.location.href = `level-select.html?player=${encodeURIComponent(playerName)}`;
                });
                
                buttons.appendChild(levelsBtn);
                buttons.appendChild(newMarathonBtn);
                buttons.appendChild(menuBtn);
                resultScreen.appendChild(buttons);
                
            } 
            else {
                const title = Utils.createElement('h2', 'result-title', 'Уровень пройден!');
                const scoreDisplay = Utils.createElement('div', 'result-score', `${score} очков`);
                const messageDisplay = Utils.createElement('p', 'result-message', message);
                
                resultScreen.appendChild(title);
                resultScreen.appendChild(scoreDisplay);
                
                if (bonus > 0) {
                    const bonusDisplay = Utils.createElement('p', 'result-bonus', `(+${bonus} очков за оставшееся время)`);
                    resultScreen.appendChild(bonusDisplay);
                }
                
                resultScreen.appendChild(messageDisplay);
                
                const buttons = Utils.createElement('div', 'result-buttons');
                
                if (level < 3) {
                    const nextLevel = marathonMode ? level + 1 : level + 1;
                    const nextBtn = Utils.createElement('button', ['btn', 'btn-primary'], 
                        marathonMode ? `Уровень ${nextLevel} →` : 'Следующий уровень →');
                    
                    nextBtn.addEventListener('click', function() {
                        window.location.href = `game.html?player=${encodeURIComponent(playerName)}&level=${nextLevel}&mode=${marathonMode ? 'marathon' : ''}&score=${totalAccumulatedScore}`;
                    });
                    buttons.appendChild(nextBtn);
                }
                
                const repeatBtn = Utils.createElement('button', ['btn', 'btn-secondary'], '↻ Повторить уровень');
                repeatBtn.addEventListener('click', function() {
                    window.location.href = `game.html?player=${encodeURIComponent(playerName)}&level=${level}&mode=${marathonMode ? 'marathon' : ''}`;
                });
                
                const levelsBtn = Utils.createElement('button', ['btn', 'btn-secondary'], '← Выбор уровня');
                levelsBtn.addEventListener('click', function() {
                    window.location.href = `level-select.html?player=${encodeURIComponent(playerName)}`;
                });
                
                buttons.appendChild(repeatBtn);
                buttons.appendChild(levelsBtn);
                resultScreen.appendChild(buttons);
            }
            
        } 
        else {
            const title = Utils.createElement('h2', 'result-title', 'Время вышло!');
            const scoreDisplay = Utils.createElement('div', 'result-score', `${score} очков`);
            const messageDisplay = Utils.createElement('p', 'result-message', message);
            
            resultScreen.appendChild(title);
            resultScreen.appendChild(scoreDisplay);
            resultScreen.appendChild(messageDisplay);
            
            const buttons = Utils.createElement('div', 'result-buttons');
            
            const repeatBtn = Utils.createElement('button', ['btn', 'btn-primary'], '↻ Попробовать снова');
            repeatBtn.addEventListener('click', function() {
                window.location.href = `game.html?player=${encodeURIComponent(playerName)}&level=${level}&mode=${marathonMode ? 'marathon' : ''}`;
            });
            
            const levelsBtn = Utils.createElement('button', ['btn', 'btn-secondary'], '← Выбор уровня');
            levelsBtn.addEventListener('click', function() {
                window.location.href = `level-select.html?player=${encodeURIComponent(playerName)}`;
            });
            
            buttons.appendChild(repeatBtn);
            buttons.appendChild(levelsBtn);
            resultScreen.appendChild(buttons);
        }
        
        gameArea.appendChild(resultScreen);
    }
    
    function createLevel1Interface(question) {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';

        const title = Utils.createElement('h3', 'question-title', 'Распределите слова по категориям');
        const progress = Utils.createElement('div', 'question-progress', `Вопрос ${currentQuestion + 1} из ${questions.length}`);
        const instructions = Utils.createElement('div', 'instructions');
        instructions.innerHTML = `
            <h4>Как играть:</h4>
            <ul>
                <li>Перетаскивайте слова в правильные категории</li>
                <li>Каждое слово относится только к одной категории</li>
                <li>Нажмите "Проверить ответ" для проверки</li>
                <li>За каждый правильный ответ +100 баллов</li>
                <li>За каждый неправильный ответ -50 баллов</li>
            </ul>
        `;

        const wordsContainer = Utils.createElement('div', 'words-container');
        wordsContainer.id = 'words-container';

        const categoriesContainer = Utils.createElement('div', 'categories-container');
        categoriesContainer.id = 'categories-container';

        const checkButton = Utils.createElement('button', ['btn', 'btn-primary', 'check-btn'], 'Проверить ответ');
        checkButton.addEventListener('click', checkLevel1Answer);

        questionContainer.appendChild(title);
        questionContainer.appendChild(progress);
        questionContainer.appendChild(instructions);
        questionContainer.appendChild(wordsContainer);
        questionContainer.appendChild(categoriesContainer);
        questionContainer.appendChild(checkButton);

        gameArea.appendChild(questionContainer);
        
        createDraggableWords(question.words);
        createCategories(question.categories);
    }

    function createDraggableWords(words) {
        const wordsContainer = document.getElementById('words-container');
        const shuffledWords = Utils.shuffleArray([...words]);
        
        shuffledWords.forEach((word, index) => {
            setTimeout(() => {
                const wordElement = Utils.createElement('div', 'draggable-word', word);
                wordElement.draggable = true;
                wordElement.dataset.word = word;
                
                wordElement.addEventListener('dragstart', handleDragStart);
                wordElement.addEventListener('dragend', handleDragEnd);
                
                wordElement.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                });
                
                wordElement.addEventListener('mouseleave', function() {
                    if (!this.dragging) {
                        this.style.transform = '';
                        this.style.boxShadow = '';
                    }
                });
                
                wordsContainer.appendChild(wordElement);
            }, index * 100);
        });
    }
    
    function createCategories(categories) {
        const categoriesContainer = document.getElementById('categories-container');
        
        categories.forEach((category, index) => {
            const categoryElement = Utils.createElement('div', 'category-box', category);
            categoryElement.dataset.category = category;
            
            categoryElement.addEventListener('dragover', handleDragOver);
            categoryElement.addEventListener('dragenter', handleDragEnter);
            categoryElement.addEventListener('dragleave', handleDragLeave);
            categoryElement.addEventListener('drop', handleDrop);
            
            categoryElement.addEventListener('mouseenter', function() {
                if (!this.classList.contains('dragover')) {
                    this.style.backgroundColor = '#f0f8ff';
                }
            });
            
            categoryElement.addEventListener('mouseleave', function() {
                if (!this.classList.contains('dragover')) {
                    this.style.backgroundColor = '';
                }
            });

            const dropZone = Utils.createElement('div', 'drop-zone');
            dropZone.dataset.category = category;
            categoryElement.appendChild(dropZone);
            
            categoriesContainer.appendChild(categoryElement);
        });
    }

    let draggedWord = null;
    
    function handleDragStart(e) {
        draggedWord = this;
        this.dragging = true;
        e.dataTransfer.setData('text/plain', this.dataset.word);
        e.dataTransfer.effectAllowed = 'move';
    }
    
    function handleDragEnd(e) {
        this.dragging = false;
        this.style.transform = '';
        draggedWord = null;

        document.querySelectorAll('.category-box').forEach(cat => {
            cat.classList.remove('dragover');
            cat.style.backgroundColor = '';
        });
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        this.classList.add('dragover');
        this.style.backgroundColor = '#e3f2fd';
        this.style.transform = 'scale(1.02)';
    }
    
    function handleDragLeave(e) {
        this.classList.remove('dragover');
        this.style.backgroundColor = '';
        this.style.transform = '';
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const word = e.dataTransfer.getData('text/plain');
        const wordElement = document.querySelector(`.draggable-word[data-word="${word}"]`);
        
        if (wordElement && this.classList.contains('category-box')) {
            const dropZone = this.querySelector('.drop-zone');
            wordElement.remove();

            const wordInCategory = Utils.createElement('div', 'word-in-category', word);
            wordInCategory.dataset.word = word;
            wordInCategory.dataset.category = this.dataset.category;

            wordInCategory.style.animation = 'popIn 0.3s ease';

            const removeBtn = Utils.createElement('span', 'remove-word', '×');
            removeBtn.addEventListener('click', function() {
                returnWordToContainer(word, wordInCategory);
            });
            
            wordInCategory.appendChild(removeBtn);
            dropZone.appendChild(wordInCategory);
            
            updateCorrectAnswers(this.dataset.category, word, true);
        }
        this.classList.remove('dragover');
        this.style.backgroundColor = '';
        this.style.transform = '';
        
        return false;
    }
    
    function returnWordToContainer(word, wordElement) {
        const wordsContainer = document.getElementById('words-container');
        wordElement.remove();

        const newWordElement = Utils.createElement('div', 'draggable-word', word);
        newWordElement.dataset.word = word;
        newWordElement.draggable = true;

        newWordElement.style.animation = 'popIn 0.3s ease';

        newWordElement.addEventListener('dragstart', handleDragStart);
        newWordElement.addEventListener('dragend', handleDragEnd);

        newWordElement.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
        
        newWordElement.addEventListener('mouseleave', function() {
            if (!this.dragging) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
        
        wordsContainer.appendChild(newWordElement);

        const category = wordElement.dataset.category;
        updateCorrectAnswers(category, word, false);
    }
    
    function updateCorrectAnswers(category, word, added) {
        if (!correctAnswers[currentQuestion]) {
            correctAnswers[currentQuestion] = [];
        }
        
        if (added) {
            correctAnswers[currentQuestion].push({ category, word });
        } 
        else {
            correctAnswers[currentQuestion] = correctAnswers[currentQuestion].filter(
                item => !(item.category === category && item.word === word)
            );
        }
    }
    
    function checkLevel1Answer() {
        const question = questions[currentQuestion];
        let correctCount = 0;
        let totalPossible = question.words.length;
        
        const placedWords = document.querySelectorAll('.word-in-category');
        if (placedWords.length < totalPossible) {
            return;
        }

        question.words.forEach(word => {
            const wordElement = document.querySelector(`.word-in-category[data-word="${word}"]`);
            if (wordElement) {
                const userCategory = wordElement.dataset.category;
                const isCorrect = checkIfCorrect(word, userCategory, question);
                
                if (isCorrect) {
                    correctCount++;
                    wordElement.classList.add('correct');
                    wordElement.style.backgroundColor = '#d4edda';
                } 
                else {
                    wordElement.classList.add('incorrect');
                    wordElement.style.backgroundColor = '#f8d7da';
                    
                    const correctCategory = getCorrectCategory(word, question);
                    wordElement.title = `Правильно: ${correctCategory}`;
                }
            }
        });

        let questionScore = 0;
        if (correctCount === totalPossible) {
            questionScore = Config.LEVELS[level].points;
        } 
        else {
            questionScore = -50;
        }
        score += questionScore;
        scoreElement.textContent = score;
        
        totalAccumulatedScore = score;

        scoreElement.classList.add('score-update');
        setTimeout(() => {
            scoreElement.classList.remove('score-update');
        }, 500);

        setTimeout(() => {
            currentQuestion++;
            showQuestion();
        }, 2000);
    }

    function checkIfCorrect(word, userCategory, question) {
        const wordLower = word.toLowerCase().trim();
        const userCategoryLower = userCategory.toLowerCase().trim();

        if (question.correctPairs) {
            for (const [category, words] of Object.entries(question.correctPairs)) {
                if (category.toLowerCase() === userCategoryLower) {
                    const wordsLower = words.map(w => w.toLowerCase());
                    return wordsLower.includes(wordLower);
                }
            }
        }
        return false;
    }

    function getCorrectCategory(word, question) {
        const wordLower = word.toLowerCase().trim();

        if (question.correctPairs) {
            for (const [category, words] of Object.entries(question.correctPairs)) {
                const wordsLower = words.map(w => w.toLowerCase());
                if (wordsLower.includes(wordLower)) {
                    return category;
                }
            }
        }
        return 'Неизвестная категория';
    }
    

    
    function createLevel2Interface(question) {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container ';
        
        const title = Utils.createElement('h3', 'question-title', 'Соберите слово из букв');
        const progress = Utils.createElement('div', 'question-progress', `Вопрос ${currentQuestion + 1} из ${questions.length}`);
        const instructions = Utils.createElement('div', 'instructions');
        instructions.innerHTML = `
            <h4>Как играть:</h4>
            <ul>
                <li>Двойной клик по букве - захватить букву</li>
                <li>Клик по слоту - поместить букву</li>
                <li>Нажмите "Проверить слово" для проверки</li>
                <li>За каждый правильный ответ +150 баллов</li>
                <li>За каждый неправильный ответ -50 баллов</li>
            </ul>
        `;

        const hint = Utils.createElement('p', 'level2-hint', `Подсказка: ${question.hint}`);

        const lettersContainer = Utils.createElement('div', 'flying-letters-container');
        lettersContainer.id = 'flying-letters-container';

        const wordContainer = Utils.createElement('div', 'word-assembly-container');
        wordContainer.id = 'word-assembly-container';

        for (let i = 0; i < question.answer.length; i++) {
            const slot = Utils.createElement('div', 'letter-slot', '?');
            slot.dataset.index = i;
            slot.dataset.expected = question.answer[i];
            wordContainer.appendChild(slot);
        }
 
        const checkButton = Utils.createElement('button', ['check-btn'], 'Проверить слово');
        checkButton.addEventListener('click', checkLevel2Answer);

        questionContainer.appendChild(title);
        questionContainer.appendChild(progress);
        questionContainer.appendChild(instructions);
        questionContainer.appendChild(hint);
        questionContainer.appendChild(lettersContainer);
        questionContainer.appendChild(wordContainer);
        questionContainer.appendChild(checkButton);
        
        gameArea.appendChild(questionContainer);

        createFlyingLetters(question);
 
        setupLevel2Controls();
    }
    
    function createFlyingLetters(question) {
        const lettersContainer = document.getElementById('flying-letters-container');
        const shuffledLetters = Utils.shuffleArray([...question.letters]);
        
        Utils.clearElement(lettersContainer);
        
        const containerWidth = lettersContainer.clientWidth || 800;
        const containerHeight = lettersContainer.clientHeight || 300;
        
        const occupiedPositions = [];

        shuffledLetters.forEach((letter, index) => {
            let posX, posY;
            let attempts = 0;
            const maxAttempts = 50;

            do {
                posX = Utils.random(20, containerWidth - 80);
                posY = Utils.random(20, containerHeight - 80);
                attempts++;

                let hasCollision = false;
                for (const occupied of occupiedPositions) {
                    const distance = Math.sqrt(
                        Math.pow(posX - occupied.x, 2) + Math.pow(posY - occupied.y, 2)
                    );
                    if (distance < 70) { 
                        hasCollision = true;
                        break;
                    }
                }
                
                if (!hasCollision || attempts >= maxAttempts) {
                    break;
                }
            } while (true);

            occupiedPositions.push({ x: posX, y: posY });
            
            const letterElement = Utils.createElement('div', 'flying-letter', letter);
            letterElement.dataset.letter = letter;
            letterElement.dataset.originalIndex = index;
            letterElement.dataset.selected = 'false';

            letterElement.style.position = 'absolute';
            letterElement.style.left = `${posX}px`;
            letterElement.style.top = `${posY}px`;
            letterElement.style.cursor = 'pointer';

            letterElement.addEventListener('dblclick', function() {
                captureLetter(this);
            });
            
            letterElement.addEventListener('click', function() {
                selectLetter(this);
            });
            
            letterElement.addEventListener('mouseenter', function() {
                if (this.dataset.selected === 'false') {
                    this.style.transform = 'scale(1.1)';
                }
            });
            
            letterElement.addEventListener('mouseleave', function() {
                if (this.dataset.selected === 'false') {
                    this.style.transform = '';
                }
            });

            letterElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            letterElement.style.transition = 'all 0.3s ease';
            
            lettersContainer.appendChild(letterElement);
        });
    }
    
    function captureLetter(letterElement) {
        if (letterElement.dataset.selected === 'true') 
            return;

        if (window.selectedLetter && window.selectedLetter !== letterElement) {
            releaseLetter(window.selectedLetter);
        }

        letterElement.dataset.selected = 'true';
        letterElement.classList.add('captured');
        letterElement.style.animation = 'captureLetter 0.5s ease';

        window.selectedLetter = letterElement;

        clearTimeout(window.letterReleaseTimeout); 
        window.letterReleaseTimeout = setTimeout(() => {
            if (letterElement.dataset.selected === 'true' && window.selectedLetter === letterElement) {
                releaseLetter(letterElement);
            }
        }, 5000);
    }

    function releaseLetter(letterElement) {
        if (letterElement.dataset.selected !== 'true') 
            return;

        letterElement.dataset.selected = 'false';
        letterElement.classList.remove('captured');
        letterElement.style.animation = '';
        
        if (window.selectedLetter === letterElement) {
            window.selectedLetter = null;
        }
    }
    
    function selectLetter(letterElement) {
        const letters = document.querySelectorAll('.flying-letter');
        letters.forEach(letter => {
            letter.classList.remove('selected');
        });
        
        letterElement.classList.add('selected');
    }
    
    function setupLevel2Controls() {
        const slots = document.querySelectorAll('.letter-slot');
        slots.forEach(slot => {
            slot.addEventListener('click', function() {
                if (window.selectedLetter && window.selectedLetter.dataset.selected === 'true') {
                    placeLetterInSlot(this, window.selectedLetter);
                }
            });
        });
        document.addEventListener('keydown', handleLevel2Keyboard);
    }
    
    function handleLevel2Keyboard(e) {
        const letters = Array.from(document.querySelectorAll('.flying-letter'));
        if (letters.length === 0) 
            return;
        
        let currentIndex = -1;
        
        if (window.selectedLetter) {
            currentIndex = letters.indexOf(window.selectedLetter);
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (currentIndex === -1) 
                    currentIndex = letters.length;
                const prevIndex = (currentIndex - 1 + letters.length) % letters.length;
                selectLetter(letters[prevIndex]);
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                if (currentIndex === -1) 
                    currentIndex = -1;
                const nextIndex = (currentIndex + 1) % letters.length;
                selectLetter(letters[nextIndex]);
                break;
                
            case ' ':
                e.preventDefault();
                if (window.selectedLetter) {
                    if (window.selectedLetter.dataset.selected === 'true') {
                        releaseLetter(window.selectedLetter);
                    } 
                    else {
                        captureLetter(window.selectedLetter);
                    }
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                document.querySelector('.check-btn')?.click();
                break;
        }
    }
    
    function placeLetterInSlot(slot, letterElement) {
        if (letterElement.dataset.selected !== 'true') 
            return;
        if (slot.dataset.letter) {
            const existingLetterIndex = slot.dataset.letterElement;
            const allLetters = document.querySelectorAll('.flying-letter');
            if (existingLetterIndex !== undefined && allLetters[existingLetterIndex]) {
                const existingLetter = allLetters[existingLetterIndex];
                existingLetter.style.opacity = '1';
                existingLetter.style.pointerEvents = 'auto';
            }
        }

        slot.textContent = letterElement.textContent;
        slot.dataset.letter = letterElement.textContent;
        slot.dataset.letterElement = letterElement.dataset.originalIndex;
        slot.classList.add('filled');

        letterElement.style.opacity = '0';
        letterElement.style.pointerEvents = 'none';

        releaseLetter(letterElement);

        slot.style.backgroundColor = '#f8f9fa';
        slot.style.border = '2px solid #dee2e6';
    }
    
    function checkLevel2Answer() {
        const question = questions[currentQuestion];
        const slots = document.querySelectorAll('.letter-slot');
        let correctCount = 0;
        let totalSlots = question.answer.length;

        const filledSlots = document.querySelectorAll('.letter-slot.filled');
        if (filledSlots.length < totalSlots) {
            return;
        }
        
        slots.forEach(slot => {
            const expectedLetter = slot.dataset.expected;
            const actualLetter = slot.dataset.letter;
            
            if (expectedLetter === actualLetter) {
                correctCount++;
                slot.classList.add('correct');
                slot.classList.remove('incorrect');
            } 
            else {
                slot.classList.add('incorrect');
                slot.classList.remove('correct');
                
                const correctLetter = slot.dataset.expected;
                slot.title = `Правильно: ${correctLetter}`;

                slot.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    slot.style.animation = '';
                }, 500);
            }
        });

        let questionScore = 0;
        if (correctCount === totalSlots) {
            questionScore = Config.LEVELS[level].points;
        } 
        else {
            questionScore = -50;
        }
        score += questionScore;
        scoreElement.textContent = score;
        
        totalAccumulatedScore = score;
        
        scoreElement.classList.add('score-update');
        setTimeout(() => {
            scoreElement.classList.remove('score-update');
        }, 500);
        
        setTimeout(() => {
            currentQuestion++;
            showQuestion();
        }, 2000);
    }



    function createLevel3Interface(question) {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
    
        const title = Utils.createElement('h3', 'question-title', 'Соедините слова с их определениями');
        const progress = Utils.createElement('div', 'question-progress', `Вопрос ${currentQuestion + 1} из ${questions.length}`);
        const instructions = Utils.createElement('div', 'instructions');
        instructions.innerHTML = `
            <h4>Как играть:</h4>
            <ul>
                <li>Кликните на слово в левой колонке</li>
                <li>Кликните на определение в правой колонке</li>
                <li>Пара будет соединена и пронумерована</li>
                <li>Соедините все слова с правильными определениями</li>
                <li>Каждое соединение будет своего цвета</li>
                <li>Нажмите "Проверить соответствия"</li>
                <li>Очистить линии можно кнопкой Очистить все линии"</li>
                <li>За каждый правильный ответ +200 баллов</li>
                <li>За каждый неправильный ответ -50 баллов</li>
            </ul>
        `;

        const columnsContainer = Utils.createElement('div', 'level3-columns-container');
        columnsContainer.id = 'level3-columns-container';

        const checkButton = Utils.createElement('button', ['check-btn'], 'Проверить соответствия');
        checkButton.addEventListener('click', checkLevel3Answer);

        const clearButton = Utils.createElement('button', ['btn', 'btn-warning'], 'Очистить все линии');
        clearButton.addEventListener('click', clearAllConnections);

        questionContainer.appendChild(title);
        questionContainer.appendChild(progress);
        questionContainer.appendChild(instructions);
        questionContainer.appendChild(columnsContainer);
    
        const buttonContainer = Utils.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.alignItems = 'center';

        buttonContainer.appendChild(checkButton);
        buttonContainer.appendChild(clearButton);
    
        questionContainer.appendChild(buttonContainer);
        gameArea.appendChild(questionContainer);

        createLevel3Columns(question);
    }

    function createLevel3Columns(question) {
        const columnsContainer = document.getElementById('level3-columns-container');
        Utils.clearElement(columnsContainer);

        const shuffledWords = Utils.shuffleArray([...question.words]);
        const shuffledDefinitions = Utils.shuffleArray([...question.definitions]);

        const wordsColumn = Utils.createElement('div', 'level3-column');
        wordsColumn.id = 'words-column';
    
        const wordsTitle = Utils.createElement('h4', 'column-title', 'Слова');
        wordsColumn.appendChild(wordsTitle);
    
        shuffledWords.forEach((word, index) => {
            const wordElement = Utils.createElement('div', 'level3-item word-item', word);
            wordElement.dataset.word = word;
            wordElement.dataset.index = index;
            wordElement.dataset.type = 'word';
            wordElement.dataset.id = `word-${index}`;
        
            wordElement.addEventListener('click', function(e) {
                handleItemClick(this, e);
            });
        
            wordElement.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = '#e3f2fd';
                }
            });
        
            wordElement.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected') && !this.classList.contains('connected')) {
                    this.style.backgroundColor = '';
                }
            });
        
            wordsColumn.appendChild(wordElement);
        });

        const definitionsColumn = Utils.createElement('div', 'level3-column');
        definitionsColumn.id = 'definitions-column';
    
        const definitionsTitle = Utils.createElement('h4', 'column-title', 'Определения');
        definitionsColumn.appendChild(definitionsTitle);
    
        shuffledDefinitions.forEach((definition, index) => {
            const definitionElement = Utils.createElement('div', 'level3-item definition-item', definition);
            definitionElement.dataset.definition = definition;
            definitionElement.dataset.index = index;
            definitionElement.dataset.type = 'definition';
            definitionElement.dataset.id = `def-${index}`;
        
            definitionElement.addEventListener('click', function(e) {
                handleItemClick(this, e);
            });
        
            definitionElement.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = '#f0fff4';
                }
            });
        
            definitionElement.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected') && !this.classList.contains('connected')) {
                    this.style.backgroundColor = '';
                }
            });
        
            definitionsColumn.appendChild(definitionElement);
        });
    
        columnsContainer.appendChild(wordsColumn);
        columnsContainer.appendChild(definitionsColumn);
    
        if (!window.level3Connections) window.level3Connections = {};
        if (!window.level3Connections[currentQuestion]) {
            window.level3Connections[currentQuestion] = [];
        }
    }

    function handleItemClick(element, event) {
        event.preventDefault();
    
        const type = element.dataset.type;
        const id = element.dataset.id;
    
        if (element.classList.contains('connected')) 
            return;
    
        if (!window.selectedLevel3Item) {
            selectLevel3Item(element);
            return;
        }
    
        const selectedType = window.selectedLevel3Item.dataset.type;
        if (selectedType !== type) {
            createConnection(window.selectedLevel3Item, element);
        }
        deselectAllItems();
    }   

    function selectLevel3Item(element) {
        deselectAllItems();
    
        element.classList.add('selected');
        window.selectedLevel3Item = element;
    
        if (element.dataset.type === 'word') {
            element.style.backgroundColor = '#bbdefb';
            element.style.borderColor = '#1976d2';
        } 
        else {
            element.style.backgroundColor = '#c8e6c9';
            element.style.borderColor = '#388e3c';
        }
    }

    function deselectAllItems() {
        document.querySelectorAll('.level3-item.selected').forEach(item => {
            item.classList.remove('selected');
            item.style.backgroundColor = '';
            item.style.borderColor = '';
        });
        window.selectedLevel3Item = null;
    }

    function createConnection(wordElement, definitionElement) {
        const wordId = wordElement.dataset.id;
        const definitionId = definitionElement.dataset.id;
        const word = wordElement.dataset.word;
        const definition = definitionElement.dataset.definition;
        const existingConnections = window.level3Connections[currentQuestion] || [];
        
        const connection = {
            wordId: wordId,
            definitionId: definitionId,
            word: word,
            definition: definition,
            wordElement: wordElement,
            definitionElement: definitionElement
        };
        
        existingConnections.push(connection);
        window.level3Connections[currentQuestion] = existingConnections;
        
        wordElement.classList.add('connected');
        definitionElement.classList.add('connected');
        
        const connectionNumber = existingConnections.length;
        wordElement.dataset.connectionNumber = connectionNumber;
        definitionElement.dataset.connectionNumber = connectionNumber;

        addConnectionNumber(wordElement, connectionNumber);
        addConnectionNumber(definitionElement, connectionNumber);
        
    }

    function addConnectionNumber(element, number) {
        const oldNumber = element.querySelector('.connection-number');
        if (oldNumber) oldNumber.remove();

        const numberElement = document.createElement('span');
        numberElement.className = 'connection-number';
        numberElement.textContent = number;
        element.appendChild(numberElement);
    }


    function clearAllConnections() {
        window.level3Connections[currentQuestion] = [];

        document.querySelectorAll('.level3-item').forEach(item => {
            item.classList.remove('connected', 'selected');
            item.style.backgroundColor = '';
            item.style.borderColor = '';

            const numberElement = item.querySelector('.connection-number');
            if (numberElement)
                numberElement.remove();
            
            delete item.dataset.connectionNumber;
        });
        
        deselectAllItems();
    }

    function checkLevel3Answer() {
        const question = questions[currentQuestion];
        const connections = window.level3Connections[currentQuestion] || [];
        
        const totalPairs = question.words.length;
        if (connections.length < totalPairs) {
            return;
        }
        
        let correctCount = 0;
        
        connections.forEach(connection => {
            const isCorrect = checkIfLevel3Correct(connection.word, connection.definition, question);

            highlightConnectionElements(connection, isCorrect);
            
            if (isCorrect) {
                correctCount++;
            }
        });
        
        let questionScore = 0;
        if (correctCount === totalPairs) {
            questionScore = Config.LEVELS[level].points;
        } 
        else {
            questionScore = -50;
        }
        
        score += questionScore;
        
        const scoreElement = document.getElementById('current-score');
        scoreElement.textContent = score;
        
        totalAccumulatedScore = score;

        scoreElement.classList.add('score-update');
        setTimeout(() => {
            scoreElement.classList.remove('score-update');
        }, 500);
    
        setTimeout(() => {
            currentQuestion++;
            showQuestion();
        }, 2000);
    }

    function checkIfLevel3Correct(word, definition, question) {
        return question.correctPairs[word] === definition;
    }

    function highlightConnectionElements(connection, isCorrect) {
        if (isCorrect) {
            connection.wordElement.style.backgroundColor = '#d4edda';
            connection.wordElement.style.borderColor = '#28a745';
            connection.definitionElement.style.backgroundColor = '#d4edda';
            connection.definitionElement.style.borderColor = '#28a745';
        } 
        else {
            connection.wordElement.style.backgroundColor = '#f8d7da';
            connection.wordElement.style.borderColor = '#dc3545';
            connection.definitionElement.style.backgroundColor = '#f8d7da';
            connection.definitionElement.style.borderColor = '#dc3545';
        }
    }
}