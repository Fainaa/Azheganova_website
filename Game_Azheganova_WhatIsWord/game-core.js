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