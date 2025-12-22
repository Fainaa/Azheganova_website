document.addEventListener('DOMContentLoaded', function() {
    const ratingTable = document.getElementById('rating-table');
    const backBtn = document.getElementById('back-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    loadRating();
    
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    clearBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить весь рейтинг?')) {
            Storage.clearAll();
            loadRating();
        }
    });
    
    function loadRating() {
        const rating = Storage.getTopPlayers(10);
        ratingTable.innerHTML = '';
        
        if (rating.length === 0) {
            const noData = document.createElement('div');
            noData.className = 'no-rating';
            ratingTable.appendChild(noData);
            return;
        }
        
        const list = document.createElement('div');
        list.className = 'rating-list';
        
        rating.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = 'rating-item';
            item.style.animation = 'fadeInRating 0.5s ease-out';
            
            let levelText = '';
            if (player.isMarathon) {
                levelText = 'МАРАФОН';
                item.style.background = '#fff9e6';
                item.style.borderLeft = '4px solid #FFD700';
            } else {
                levelText = `Ур. ${player.level}`;
            }
            
            item.innerHTML = `
                <div class="rating-name">${player.name}</div>
                <div class="rating-score">${player.score} очков</div>
                <div class="rating-level">${levelText}</div>
                <div class="rating-date">${player.date}</div>
            `;
            
            list.appendChild(item);
        });
        
        ratingTable.appendChild(list);
    }
});