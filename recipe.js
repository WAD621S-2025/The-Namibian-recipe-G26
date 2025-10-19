// Global variables
let recipes = [];
let filteredRecipes = [];
let currentCategory = 'all';
let currentSearchTerm = '';

// DOM elements
const searchInput = document.getElementById('searchInput');
const recipeGrid = document.getElementById('recipeGrid');
const resultsCount = document.getElementById('resultsCount');
const noResults = document.getElementById('noResults');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('recipeModal');

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    loadRecipes();
});

// Load recipes from database
async function loadRecipes() {
    try {
        const params = new URLSearchParams({
            category: currentCategory,
            search: currentSearchTerm,
            limit: 50,
            offset: 0
        });

        console.log('Fetching recipes from:', `get_recipe.php?${params}`);
        const response = await fetch(`get_recipe.php?${params}`);
        console.log('Response status:', response.status);
        
        const text = await response.text();
        console.log('Response text:', text);
        
        const data = JSON.parse(text);
        console.log('Parsed data:', data);

        if (data.success) {
            recipes = data.recipes.map(recipe => ({
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                image: recipe.image_data || recipe.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
                category: recipe.category,
                difficulty: recipe.difficulty,
                prepTime: recipe.prep_time,
                cookTime: recipe.cook_time,
                servings: recipe.servings,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                culturalContext: recipe.cultural_context
            }));
            filteredRecipes = [...recipes];
            renderRecipes();
        } else {
            console.error('Error loading recipes:', data.error);
            showError('Failed to load recipes: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showError('Failed to connect to the server: ' + error.message);
    }
}

// Show error message
function showError(message) {
    const recipeGrid = document.getElementById('recipeGrid');
    const noResults = document.getElementById('noResults');
    
    recipeGrid.style.display = 'none';
    noResults.style.display = 'block';
    noResults.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
        <p>${message}</p>
        <button onclick="loadRecipes()" class="btn btn-primary"><i class="fas fa-redo"></i> Retry</button>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', handleSearch);

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', handleCategoryFilter);
    });

    // Modal close events
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// Handle search functionality
function handleSearch(event) {
    currentSearchTerm = event.target.value.toLowerCase();
    filterRecipes();
}

// Handle category filtering
function handleCategoryFilter(event) {
    const category = event.target.dataset.category;

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    currentCategory = category;
    filterRecipes();
}

// Filter recipes based on search and category
function filterRecipes() {
    loadRecipes();
}

// Render recipes to the grid
function renderRecipes() {
    // Update results count
    const count = filteredRecipes.length;
    resultsCount.textContent = `${count} recipe${count !== 1 ? 's' : ''} found`;

    // Show/hide no results message
    if (count === 0) {
        recipeGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    } else {
        recipeGrid.style.display = 'grid';
        noResults.style.display = 'none';
    }

    // Render recipe cards
    recipeGrid.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card" onclick="openRecipeModal(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="category-badge"><i class="fas fa-tag"></i> ${getCategoryDisplayName(recipe.category)}</span>
                    <span style="font-size: 0.875rem; color: #6b7280;"><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                </div>
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-meta" style="margin-top: 0.75rem;">
                    <span><i class="far fa-clock"></i> ${recipe.prepTime + recipe.cookTime}min</span>
                    <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Get display name for category
function getCategoryDisplayName(category) {
    const categoryMap = {
        'main-dish': 'Main Dish',
        'snacks': 'Snacks',
        'breakfast': 'Breakfast',
        'street-food': 'Street Food',
        'staple': 'Staple',
        'seasonal': 'Seasonal'
    };
    return categoryMap[category] || category;
}

// Open recipe modal
function openRecipeModal(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="modal-recipe-image">
        <div class="modal-recipe-content">
            <div style="margin-bottom: 1.5rem;">
                <h1 style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 1rem;">
                    ${recipe.name}
                </h1>
                <p style="font-size: 1.125rem; color: #6b7280; margin-bottom: 1rem;">
                    ${recipe.description}
                </p>
                
                <div class="recipe-meta">
                    <span><i class="far fa-clock"></i> Prep: ${recipe.prepTime}min</span>
                    <span><i class="fas fa-fire"></i> Cook: ${recipe.cookTime}min</span>
                    <span><i class="fas fa-users"></i> Serves: ${recipe.servings}</span>
                    <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                </div>
            </div>

            ${recipe.culturalContext ? `
                <div class="cultural-context">
                    <h3><i class="fas fa-book-open"></i> Cultural Context</h3>
                    <p>${recipe.culturalContext}</p>
                </div>
            ` : ''}
 
            <div class="recipe-details">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1rem;"><i class="fas fa-shopping-basket"></i> Ingredients</h2>
                    <ul class="ingredients-list">
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>

                <div>
                    <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1rem;"><i class="fas fa-list-ol"></i> Instructions</h2>
                    <ol class="instructions-list">
                        ${recipe.instructions.map((instruction, index) => `
                            <li>
                                <span class="step-number">${index + 1}</span>
                                <span>${instruction}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close recipe modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Clear all filters
function clearFilters() {
    currentSearchTerm = '';
    currentCategory = 'all';
    searchInput.value = '';

    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');

    loadRecipes();
} 