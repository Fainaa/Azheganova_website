document.addEventListener('DOMContentLoaded', function() {
    const playerNameInput = document.getElementById('player-name');
    const startBtn = document.getElementById('start-btn');
    const ratingBtn = document.getElementById('rating-btn');
    const settingsBtn = Utils.createElement('button', 'theme-settings-btn', '🎨');
    settingsBtn.title = 'Настройки темы';
    settingsBtn.addEventListener('click', () => {
        window.location.href = 'settings.html';
    });
    document.body.appendChild(settingsBtn);

    playerNameInput.value = '';

    startBtn.addEventListener('click', function() {
        const name = playerNameInput.value.trim();
        
        if (!name) {
            alert('Пожалуйста, введите ваше имя');
            playerNameInput.focus();
            return;
        }

        Storage.savePlayerName(name);

        window.location.href = 'level-select.html?player=' + encodeURIComponent(name);
    });
    
    ratingBtn.addEventListener('click', function() {
        window.location.href = 'rating.html';
    });

    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startBtn.click();
        }
    });
});