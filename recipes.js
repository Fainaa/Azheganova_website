document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            for (const btn of filterButtons) {
                btn.classList.remove('active');
            }
            
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            filterRecipes(filterValue);
        });
    });

    function filterRecipes(filter) {
        
        recipeCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
            } 
            else {
                card.style.display = 'none';
            }
        });
    }
});