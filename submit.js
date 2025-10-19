// Form handling and dynamic elements
document.addEventListener('DOMContentLoaded', function() {
    setupFormHandlers();
});

function setupFormHandlers() {
    const form = document.getElementById('recipeForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Basic validation
    const recipeName = formData.get('recipe_name');
    const description = formData.get('description');
    const category = formData.get('category');
    const ingredients = formData.getAll('ingredients[]').filter(ing => ing.trim());
    const instructions = formData.getAll('instructions[]').filter(inst => inst.trim());
    
    if (!recipeName || !description || !category || ingredients.length === 0 || instructions.length === 0) {
        alert('Please fill in all required fields');
        return;
    }
     
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Submit to PHP backend
        const response = await fetch('submit_recipe.php', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage();
        } else {
            alert('Error: ' + (result.message || 'Failed to submit recipe'));
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error submitting recipe:', error);
        alert('Failed to submit recipe. Please try again.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show success message
function showSuccessMessage() {
    const formContainer = document.getElementById('formContainer');
    const successMessage = document.getElementById('successMessage');
    
    formContainer.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset form after delay
    setTimeout(() => {
        resetForm();
    }, 5000);
}

// Reset form to initial state
function resetForm() {
    const form = document.getElementById('recipeForm');
    const formContainer = document.getElementById('formContainer');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.reset();
    formContainer.style.display = 'block';
    successMessage.style.display = 'none';
    
    // Re-enable submit button
    submitBtn.textContent = 'Submit Recipe';
    submitBtn.disabled = false;
    
    // Reset dynamic lists
    resetIngredientsList();
    resetInstructionsList();
}

// Add ingredient field
function addIngredient() {
    const ingredientsList = document.getElementById('ingredientsList');
    const newIngredient = document.createElement('div');
    newIngredient.className = 'ingredient-item';
    newIngredient.innerHTML = `
        <input type="text" name="ingredients[]" placeholder="Ingredient ${ingredientsList.children.length + 1}" required>
        <button type="button" onclick="removeIngredient(this)" class="remove-btn">−</button>
    `;
    ingredientsList.appendChild(newIngredient);
}

// Remove ingredient field
function removeIngredient(button) {
    const ingredientsList = document.getElementById('ingredientsList');
    if (ingredientsList.children.length > 1) {
        button.parentElement.remove();
        updateIngredientPlaceholders();
    }
}

// Update ingredient placeholders
function updateIngredientPlaceholders() {
    const ingredients = document.querySelectorAll('#ingredientsList input');
    ingredients.forEach((input, index) => {
        input.placeholder = `Ingredient ${index + 1}`;
    });
}

// Reset ingredients list
function resetIngredientsList() {
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = `
        <div class="ingredient-item">
            <input type="text" name="ingredients[]" placeholder="Ingredient 1" required>
            <button type="button" onclick="removeIngredient(this)" class="remove-btn">−</button>
        </div>
    `;
}

// Add instruction field
function addInstruction() {
    const instructionsList = document.getElementById('instructionsList');
    const stepNumber = instructionsList.children.length + 1;
    const newInstruction = document.createElement('div');
    newInstruction.className = 'instruction-item';
    newInstruction.innerHTML = `
        <span class="step-number">${stepNumber}</span>
        <textarea name="instructions[]" placeholder="Step ${stepNumber}" rows="2" required></textarea>
        <button type="button" onclick="removeInstruction(this)" class="remove-btn">−</button>
    `;
    instructionsList.appendChild(newInstruction);
}

// Remove instruction field
function removeInstruction(button) {
    const instructionsList = document.getElementById('instructionsList');
    if (instructionsList.children.length > 1) {
        button.parentElement.remove();
        updateInstructionNumbers();
    }
}

// Update instruction step numbers
function updateInstructionNumbers() {
    const instructions = document.querySelectorAll('#instructionsList .instruction-item');
    instructions.forEach((item, index) => {
        const stepNumber = item.querySelector('.step-number');
        const textarea = item.querySelector('textarea');
        stepNumber.textContent = index + 1;
        textarea.placeholder = `Step ${index + 1}`;
    });
}

// Reset instructions list
function resetInstructionsList() {
    const instructionsList = document.getElementById('instructionsList');
    instructionsList.innerHTML = `
        <div class="instruction-item">
            <span class="step-number">1</span>
            <textarea name="instructions[]" placeholder="Step 1" rows="2" required></textarea>
            <button type="button" onclick="removeInstruction(this)" class="remove-btn">−</button>
        </div>
    `;
}