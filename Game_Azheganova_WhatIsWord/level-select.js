document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get('player') || 'Игрок';

    const playerInfo = document.getElementById('player-info');
    const levelsContainer = document.getElementById('levels-container');
    const backBtn = document.getElementById('back-btn');

    playerInfo.innerHTML = `
        <div class="player-welcome">
            <h2>Привет, ${playerName}!</h2>
            <p>Выберите уровень для начала игры:</p>
        </div>
    `;
    
    createLevelCards(playerName);

    document.getElementById('start-marathon').addEventListener('click', function() {
        window.location.href = `game.html?player=${encodeURIComponent(playerName)}&level=1&mode=marathon`;
    });
    
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    
    function createLevelCards(playerName) {
        levelsContainer.innerHTML = '';

        for (let levelNum = 1; levelNum <= 3; levelNum++) {
            const level = Config.LEVELS[levelNum];

            const levelCard = document.createElement('div');
            levelCard.className = 'level-card';

            const colors = ['#3498db', '#2ecc71', '#9b59b6'];

            levelCard.innerHTML = `
                <div class="level-card-header" style="background: ${colors[levelNum - 1]};">
                    <h3 class="level-name">Уровень ${levelNum}: ${level.name}</h3>
                </div>
                <div class="level-card-body">
                    <div class="level-info">
                        <div class="info-item">
                            <span class="info-label">Время:</span>
                            <span class="info-value">${Utils.formatTime(level.time)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Вопросов:</span>
                            <span class="info-value">${level.questions}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Сложность:</span>
                            <span class="info-value">${getDifficultyText(levelNum)}</span>
                        </div>
                    </div>
                    
                    <div class="level-description">
                        <strong>Описание:</strong><br>
                        ${getLevelDescription(levelNum)}
                    </div>

                    <div class="how-to-play">
                        <div class="how-to-play-header">
                            <h4>Как играть:</h4>
                        </div>
                        <div class="instructions">
                            ${getLevelInstructions(levelNum)}
                        </div>
                    </div>
                    
                    <button class="btn level-start-btn" data-level="${levelNum}"style="background: ${colors[levelNum - 1]}">Играть</button>
                </div>
            `;
            
            levelsContainer.appendChild(levelCard);
        }
        
        document.querySelectorAll('.level-start-btn').forEach(button => {
            button.addEventListener('click', function() {
                const levelNum = this.getAttribute('data-level');
                window.location.href = `game.html?player=${encodeURIComponent(playerName)}&level=${levelNum}`;
            });
        });
    }
    
    function getDifficultyText(levelNum) {
        switch(levelNum) {
            case 1: return 'Легкий';
            case 2: return 'Средний';
            case 3: return 'Сложный';
            default: return 'Неизвестно';
        }
    }
    
    function getLevelDescription(levelNum) {
        switch(levelNum) {
            case 1: return 'Перетаскивайте слова в правильные категории';
            case 2: return 'Собирайте слова из летающих букв';
            case 3: return 'Соединяйте слова с правильными определениями';
            default: return 'Неизвестный уровень';
        }
    }
    
    function getLevelInstructions(levelNum) {
        switch(levelNum) {
            case 1:
                return `
                    <ul>
                        <li>Перетаскивайте слова в правильные категории</li>
                        <li>Каждое слово относится только к одной категории</li>
                        <li>Нажмите "Проверить ответ" для проверки</li>
                        <li>За каждый правильный ответ +100 баллов</li>
                        <li>За каждый неправильный ответ -50 баллов</li>
                    </ul>
                `;
            case 2:
                return `
                    <ul>
                        <li>Двойной клик по букве - захватить букву</li>
                        <li>Клик по слоту - поместить букву</li>
                        <li>Нажмите "Проверить слово" для проверки</li>
                        <li>За каждый правильный ответ +150 баллов</li>
                        <li>За каждый неправильный ответ -50 баллов</li>
                    </ul>
                `;
            case 3:
                return `
                    <ul>
                        <li>Кликните на слово в левой колонке</li>
                        <li>Кликните на определение в правой колонке</li>
                        <li>Между ними появится цветная линия</li>
                        <li>Соедините все слова с правильными определениями</li>
                        <li>Каждое соединение будет своего цвета</li>
                        <li>Нажмите "Проверить соответствия"</li>
                        <li>Очистить линии можно кнопкой Очистить все линии"</li>
                        <li>За каждый правильный ответ +200 баллов</li>
                        <li>За каждый неправильный ответ -50 баллов</li>
                    </ul>
                `;
            default:
                return '<p>Инструкции для этого уровня пока не доступны</p>';
        }
    }
});