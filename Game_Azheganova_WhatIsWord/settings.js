document.addEventListener('DOMContentLoaded', function() {
    const themeSettings = document.getElementById('theme-settings');
    const currentThemePreview = document.getElementById('current-theme-preview');
    const backBtn = document.getElementById('back-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    themeSettings.appendChild(ColorThemes.createThemeSelector());
    
    function updateCurrentThemePreview() {
        const theme = ColorThemes.getCurrentTheme();
    }
    
    updateCurrentThemePreview();
    
    document.addEventListener('themeChanged', updateCurrentThemePreview);
    
    backBtn.addEventListener('click', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const playerName = urlParams.get('player');
        
        if (playerName) {
            window.location.href = `level-select.html?player=${encodeURIComponent(playerName)}`;
        } else {
            window.location.href = 'index.html';
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (confirm('Сбросить все настройки к значениям по умолчанию?')) {
            localStorage.removeItem('word_game_theme');
            ColorThemes.applyTheme('classic');
            updateCurrentThemePreview();
            alert('Настройки сброшены!');
        }
    });
});