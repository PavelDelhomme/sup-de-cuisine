import { filterRecipes, allRecipes } from './dataHandler.js';
import { showRecipeModal } from './modalHandler.js';

let currentPage = 1;
const recipesPerPage = 9;

// Afficher les recettes avec pagination
export function displayRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    container.innerHTML = "";

    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToDisplay = recipes.slice(startIndex, endIndex);

    recipesToDisplay.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        container.appendChild(recipeCard);
    });

    document.getElementById("recipe-count").textContent = `Nombre de recettes affichées : ${recipes.length}`;
    updatePagination(recipes.length);
}

// Créer une carte de recette
function createRecipeCard(recipe) {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.onclick = () => showRecipeModal(recipe);

    const image = document.createElement("img");
    image.src = `http://127.0.0.1:5500/sup_de_cuisine/images/${recipe.image}`;
    image.alt = recipe.name;
    image.onerror = () => {
        image.src = "https://via.placeholder.com/200";
        console.warn(`Image introuvable : ${recipe.image}`);
    };

    const title = document.createElement("div");
    title.classList.add("recipe-title");
    title.textContent = recipe.name;

    const description = document.createElement("div");
    description.classList.add("recipe-description");
    description.textContent = `Recette : ${recipe.description.split('.').slice(0, 1).join('.')}`;

    const ingredients = document.createElement("div");
    ingredients.classList.add("recipe-ingredients");
    recipe.ingredients.forEach(ing => {
        const ingredientRow = document.createElement("div");
        ingredientRow.classList.add("recipe-ingredients-row");

        const ingredientName = document.createElement("span");
        ingredientName.innerHTML = `<strong>${ing.ingredient}</strong>`;

        const ingredientQuantity = document.createElement("span");
        ingredientQuantity.textContent = `${ing.quantity || ''} ${ing.unit || ''}`;

        ingredientRow.appendChild(ingredientName);
        ingredientRow.appendChild(ingredientQuantity);
        ingredients.appendChild(ingredientRow);
    });

    recipeCard.appendChild(image);
    recipeCard.appendChild(title);
    recipeCard.appendChild(description);
    recipeCard.appendChild(ingredients);
    return recipeCard;
}

// Mettre à jour la pagination
function updatePagination(totalRecipes) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            displayRecipes(allRecipes);
        };
        if (i === currentPage) {
            button.style.backgroundColor = "#ff5722";
        }
        paginationContainer.appendChild(button);
    }
}

// Gérer la recherche
export function handleSearch(query) {
    const filteredRecipes = filterRecipes(query);
    currentPage = 1; // Réinitialiser à la première page
    displayRecipes(filteredRecipes);
}
