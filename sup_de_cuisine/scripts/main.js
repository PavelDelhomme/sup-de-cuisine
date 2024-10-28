let allRecipes = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/recipes.json")
        .then(response => response.json())
        .then(data => {
            allRecipes = data;
            displayRecipes(allRecipes);
        })
        .catch(error => console.error("Erreur de chargement des données :", error));

    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredRecipes = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
        );
        displayRecipes(filteredRecipes);
    });

    document.getElementById("close-modal").addEventListener("click", closeModal);
});

function displayRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    container.innerHTML = ""; // Réinitialise l'affichage des recettes

    recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.onclick = () => showRecipeModal(recipe);

        const image = document.createElement("img");
        image.src = `data/images/${recipe.image}`;
        image.alt = recipe.name;

        const title = document.createElement("div");
        title.classList.add("recipe-title");
        title.textContent = recipe.name;

        recipeCard.appendChild(image);
        recipeCard.appendChild(title);
        container.appendChild(recipeCard);
    });
}

function showRecipeModal(recipe) {
    document.getElementById("modal-title").textContent = recipe.name;
    document.getElementById("modal-image").src = `data/images/${recipe.image}`;
    document.getElementById("modal-image").alt = recipe.name;
    document.getElementById("modal-servings").textContent = `Portions : ${recipe.servings}`;
    document.getElementById("modal-time").textContent = `Temps de préparation : ${recipe.time} minutes`;

    const ingredientsList = document.getElementById("modal-ingredients");
    ingredientsList.innerHTML = "<strong>Ingrédients :</strong>"; // Réinitialise la liste
    recipe.ingredients.forEach(ing => {
        const ingredientBadge = document.createElement("span");
        ingredientBadge.classList.add("ingredient-badge");
        ingredientBadge.textContent = `${ing.ingredient} - ${ing.quantity || ''} ${ing.unit || ''}`;
        //const li = document.createElement("li");
        //li.textContent = `${ing.ingredient} - ${ing.quantity || ''} ${ing.unit || ''}`;
        //ingredientsList.appendChild(li);
        ingredientsList.appendChild(ingredientBadge);
    });

    document.getElementById("modal-description").textContent = recipe.description;

    // Affiche la modale
    document.getElementById("recipe-modal").classList.remove("hidden");
    document.getElementById("recipe-modal").style.display = "flex"; // Applique l'affichage flex
}


function closeModal() {
    document.getElementById("recipe-modal").classList.add("hidden");
}
