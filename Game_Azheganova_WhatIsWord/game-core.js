const Storage = {
    KEY_PLAYERS: 'word_game_players',

    getPlayerName() {
        return localStorage.getItem('player_name') || '';
    },
    
    savePlayerName(name) {
        localStorage.setItem('player_name', name);
        return true;
    },

    savePlayerResult(name, score, level = 1, isMarathon = false) {
        try {
            let allResults = this.getPlayersResults();
            const newResult = {
                name: name,
                score: score,
                level: level,
                date: new Date().toLocaleString(),
                isMarathon: isMarathon
            };
            
            if (isMarathon) {
                allResults = allResults.filter(result => 
                    !(result.name === name && result.isMarathon === true)
                );
            }
            
            allResults.push(newResult);
            
            allResults.sort((a, b) => b.score - a.score);
            
            const topResults = allResults.slice(0, 10);
            
            localStorage.setItem(this.KEY_PLAYERS, JSON.stringify(topResults));
            
            return true;
        } 
        catch (error) {
            return false;
        }
    },

    getPlayersResults() {
        try {
            const data = localStorage.getItem(this.KEY_PLAYERS);
            const results = data ? JSON.parse(data) : [];
            
            return results.map(result => ({
                ...result,
                isMarathon: result.isMarathon || false
            }));
        } 
        catch (error) {
            return [];
        }
    },

    getTopPlayers(count = 10) {
        const results = this.getPlayersResults();
        return results.slice(0, count);
    },

    clearAll() {
        localStorage.removeItem(this.KEY_PLAYERS);
        localStorage.removeItem('player_name');
    }
};



const Utils = {
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    createElement(tag, className = '', text = '') {
        const element = document.createElement(tag);
        
        if (className) {
            if (Array.isArray(className)) {
                element.className = className.join(' ');
            } else {
                element.className = className;
            }
        }
        
        if (text) {
            element.textContent = text;
        }
        
        return element;
    },

    clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
};




const Config = {
    
    LEVELS: {
        1: {
            name: 'Сортировка слов',
            time: 120,
            questions: 5,
            points: 100,
            description: 'Перетаскивайте слова в правильные категории'
        },
        2: {
            name: 'Сборка слова',
            time: 180,
            questions: 4,
            points: 150,
            description: 'Собирайте слова из летающих букв'
        },
        3: {
            name: 'Словесный лабиринт',
            time: 180,
            questions: 3,
            points: 200,
            description: 'Соединяйте слова с определениями'
        }
    },
    
    SCORE: {
        correct: 100,
        timeBonus: 10,
        penalty: -50 
    }
};




const Words = {
    level1: [
        {
            id: 1,
            question: 'Распределите животных по категориям',
            words: ['собака', 'кошка', 'воробей', 'синица', 'хомяк', 'кролик'],
            categories: ['Домашние животные', 'Птицы'],
            correctPairs: {
                'Домашние животные': ['собака', 'кошка', 'хомяк', 'кролик'],
                'Птицы': ['воробей', 'синица']
            }
        },
        {
            id: 2,
            question: 'Распределите слова по категориям',
            words: ['яблоко', 'морковь', 'помидор', 'картофель', 'апельсин', 'банан'],
            categories: ['Фрукты', 'Овощи'],
            correctPairs: {
                'Фрукты': ['яблоко', 'апельсин', 'банан'],
                'Овощи': ['морковь', 'помидор', 'картофель']
            }
        },
        {
            id: 3,
            question: 'Распределите транспорт по типам',
            words: ['автобус', 'самолет', 'велосипед', 'пароход', 'мотоцикл', 'вертолет'],
            categories: ['Наземный транспорт', 'Воздушный транспорт', 'Водный транспорт'],
            correctPairs: {
                'Наземный транспорт': ['автобус', 'велосипед', 'мотоцикл'],
                'Воздушный транспорт': ['самолет', 'вертолет'],
                'Водный транспорт': ['пароход']
            }
        },
        {
            id: 4,
            question: 'Распределите предметы по категориям',
            words: ['молоток', 'ножницы', 'ложка', 'вилка', 'отвертка', 'пила'],
            categories: ['Столовые приборы', 'Инструменты'],
            correctPairs: {
                'Столовые приборы': ['ложка', 'вилка'],
                'Инструменты': ['молоток', 'ножницы', 'отвертка', 'пила']
            }
        },
        {
            id: 5,
            question: 'Распределите предметы по категориям',
            words: ['книга', 'тетрадь', 'ручка', 'компьютер', 'телефон', 'стол'],
            categories: ['Школьные принадлежности', 'Офисные принадлежности'],
            correctPairs: {
                'Школьные принадлежности': ['книга', 'тетрадь', 'ручка'],
                'Офисные принадлежности': ['компьютер', 'телефон', 'стол']
            }
        }
    ],

    
    level2: [
        {
            id: 1,
            hint: 'Домашнее животное, которое лает',
            answer: 'собака',
            letters: ['с', 'о', 'б', 'а', 'к', 'а']
        },
        {
            id: 2,
            hint: 'Фрукт, обычно красное или зеленое',
            answer: 'яблоко',
            letters: ['я', 'б', 'л', 'о', 'к', 'о']
        },
        {
            id: 3,
            hint: 'Учебное заведение для детей',
            answer: 'школа',
            letters: ['ш', 'к', 'о', 'л', 'а']
        },
        {
            id: 4,
            hint: 'Водоем с пресной водой',
            answer: 'озеро',
            letters: ['о', 'з', 'е', 'р', 'о']
        },
        {
            id: 5,
            hint: 'Небесное тело, которое светит днем',
            answer: 'солнце',
            letters: ['с', 'о', 'л', 'н', 'ц', 'е']
        },
        {
            id: 6,
            hint: 'Столица России',
            answer: 'москва',
            letters: ['м', 'о', 'с', 'к', 'в', 'а']
        }
    ],
    
    level3: [
        {
            id: 1,
            words: ["Электричество", "Гравитация", "Магнетизм"],
            definitions: [
                "явление движения заряженных частиц",
                "сила притяжения между объектами",
                "свойство притягивать железные предметы"
            ],
            correctPairs: {
                "Электричество": "явление движения заряженных частиц",
                "Гравитация": "сила притяжения между объектами",
                "Магнетизм": "свойство притягивать железные предметы"
            }
        },
        {
            id: 2,
            words: ["Фотосинтез", "Дыхание", "Осмос"],
            definitions: [
                "процесс поглощения воды клетками",
                "процесс образования органических веществ из света",
                "процесс газообмена в клетках"
            ],
            correctPairs: {
                "Фотосинтез": "процесс образования органических веществ из света",
                "Дыхание": "процесс газообмена в клетках",
                "Осмос": "процесс поглощения воды клетками"
            }
        },
        {
            id: 3,
            words: ["Молекула", "Атом", "Электрон"],
            definitions: [
                "мельчайшая частица вещества",
                "неделимая частица химического элемента",
                "отрицательно заряженная элементарная частица"
            ],
            correctPairs: {
                "Молекула": "мельчайшая частица вещества",
                "Атом": "неделимая частица химического элемента",
                "Электрон": "отрицательно заряженная элементарная частица"
            }
        },
        {
            id: 4,
            words: ["Глагол", "Существительное", "Прилагательное"],
            definitions: [
                "часть речи, обозначающая действие",
                "часть речи, обозначающая предмет",
                "часть речи, обозначающая признак предмета"
            ],
            correctPairs: {
                "Глагол": "часть речи, обозначающая действие",
                "Существительное": "часть речи, обозначающая предмет",
                "Прилагательное": "часть речи, обозначающая признак предмета"
            }
        },
        {
            id: 5,
            words: ["Прямоугольник", "Треугольник", "Круг"],
            definitions: [
                "геометрическая фигура с тремя сторонами",
                "геометрическая фигура без углов",
                "геометрическая фигура с четырьмя прямыми углами"
            ],
            correctPairs: {
                "Прямоугольник": "геометрическая фигура с четырьмя прямыми углами",
                "Треугольник": "геометрическая фигура с тремя сторонами",
                "Круг": "геометрическая фигура без углов"
            }
        }
    ] 
};


const ColorThemes = {
    themes: {
        classic: {
            name: 'Основная',
            primary: '#3498db',
            secondary: '#2ecc71',
            accent: '#e74c3c',
            background: '#f5f7fa',
            cardBg: '#ffffff',
            text: '#2c3e50',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c',
            levelColors: ['#3498db', '#2ecc71', '#9b59b6']
        },
        nature: {
            name: 'Природа',
            primary: '#27ae60',
            secondary: '#16a085',
            accent: '#f39c12',
            background: '#ecf0f1',
            cardBg: '#ffffff',
            text: '#2c3e50',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c',
            levelColors: ['#27ae60', '#16a085', '#f39c12']
        },
        sunset: {
            name: 'Закат',
            primary: '#e74c3c',
            secondary: '#e67e22',
            accent: '#f1c40f',
            background: '#fef9e7',
            cardBg: '#ffffff',
            text: '#34495e',
            success: '#27ae60',
            warning: '#e67e22',
            danger: '#e74c3c',
            levelColors: ['#e74c3c', '#e67e22', '#f1c40f']
        },
        ocean: {
            name: 'Океан',
            primary: '#2980b9',
            secondary: '#16a085',
            accent: '#8e44ad',
            background: '#e8f4f8',
            cardBg: '#ffffff',
            text: '#2c3e50',
            success: '#27ae60',
            warning: '#f39c12',
            danger: '#e74c3c',
            levelColors: ['#2980b9', '#16a085', '#4447adff']
        },
        retro: {
            name: 'Ретро',
            primary: '#d35400',
            secondary: '#c0392b',
            accent: '#8e44ad',
            background: '#f7f1e3',
            cardBg: '#ffffff',
            text: '#2c3e50',
            success: '#27ae60',
            warning: '#d35400',
            danger: '#c0392b',
            levelColors: ['#d35400', '#c0392b', '#8e44ad']
        },
        berry: {
            name: 'Ягодная',
            primary: '#8e24aa',     
            secondary: '#d81b60',   
            accent: '#ff9800',      
            background: '#f3e5f5',   
            cardBg: '#ffffff',
            text: '#4a148c',     
            success: '#388e3c',
            warning: '#ff9800',
            danger: '#d32f2f',
            levelColors: ['#8e24aa', '#d81b60', '#ff9800']
        }
    },
    
    currentTheme: 'classic',
    
    init() {
        const savedTheme = localStorage.getItem('word_game_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
        this.applyTheme(this.currentTheme);
    },

    getLevelColors() {
        const theme = this.themes[this.currentTheme] || this.themes.classic;
        return theme.levelColors || ['#3498db', '#2ecc71', '#9b59b6'];
    },
    
    getLevelColor(levelNum) {
        const levelColors = this.getLevelColors();
        return levelColors[levelNum - 1] || levelColors[0];
    },
    
    applyTheme(themeName) {
        const theme = this.themes[themeName] || this.themes.classic;
        this.currentTheme = themeName;
        
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--background-color', theme.background);
        root.style.setProperty('--card-bg', theme.cardBg);
        root.style.setProperty('--text-color', theme.text);
        root.style.setProperty('--success-color', theme.success);
        root.style.setProperty('--warning-color', theme.warning);
        root.style.setProperty('--danger-color', theme.danger);
        
        localStorage.setItem('word_game_theme', themeName);
        
        this.updateThemeButtons();
        
        return theme;
    },
    
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    },
    
    updateThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const themeName = btn.dataset.theme;
        
        const theme = this.themes[themeName];
        btn.textContent = theme.name;
        
        if (themeName === this.currentTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
},
    
    createThemeSelector() {
        const container = Utils.createElement('div', 'theme-selector');
        container.innerHTML = '<h4>Выберите цветовую тему:</h4>';
        
        const grid = Utils.createElement('div', 'theme-grid');
        
        Object.keys(this.themes).forEach(themeKey => {
            const theme = this.themes[themeKey];
            const themeBtn = Utils.createElement('button', ['btn', 'theme-btn'], theme.name);
            themeBtn.dataset.theme = themeKey;
            
            themeBtn.style.background = theme.primary;
            themeBtn.style.color = '#ffffff';
            themeBtn.style.border = `2px solid ${theme.secondary}`;
            
            themeBtn.addEventListener('click', () => {
                this.applyTheme(themeKey);
                this.showThemeAppliedNotification(theme.name);
            });
            
            grid.appendChild(themeBtn);
        });
        
        container.appendChild(grid);
        this.updateThemeButtons();
        
        return container;
    },
    
    showThemeAppliedNotification(themeName) {
        const notification = Utils.createElement('div', 'theme-notification');
        notification.textContent = `Тема "${themeName}" применена`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 2000);
    }
};

ColorThemes.init();