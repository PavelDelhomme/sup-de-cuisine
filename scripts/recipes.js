import { filteredRecipes } from "./data.js";

const recipesPerPage = 9;
let currentPage = 1;

export function displayRecipes() {
    const main = document.querySelector("main");
    const recipeCount = document.getElementById("recipe-count");
    const paginationContainer = document.querySelector(".pagination");

    main.innerHTML = "";

    const start = (currentPage - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    const recipesToDisplay = filteredRecipes.slice(start, end);

    recipeCount.textContent = `Total : ${filteredRecipes.length} recettes`;

    if (recipesToDisplay.length === 0) {
        main.innerHTML = "<p>Aucune recette trouvée.</p>";
        if (paginationContainer) paginationContainer.innerHTML = "";
        return;
    }

    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";

    recipesToDisplay.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
        const formattedIngredients = recipe.ingredients
            .map(
                (ing) => `
            <div class="ingredient">
                <strong>${ing.ingredient}</strong>
                <span>${ing.quantity || ""} ${ing.unit || ""}</span>
            </div>
        `
            )
            .join("");

        recipeCard.innerHTML = `
            <img src="data/images/${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <h2 class="recipe-title">${recipe.name}</h2>
            <p class="recipe-description">${truncateText(recipe.description, 120)}</p>
            <div class="ingredients-grid">${formattedIngredients}</div>
        `;
        gridContainer.appendChild(recipeCard);
    });

    main.appendChild(gridContainer);
    setupPagination();
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function setupPagination() {
    const paginationContainer = document.querySelector(".pagination") || document.createElement("div");
    paginationContainer.className = "pagination";
    const main = document.querySelector("main");
    if (!document.querySelector(".pagination")) main.appendChild(paginationContainer);

    paginationContainer.innerHTML = ""; // Clear previous pagination buttons

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? "active" : "";
            pageButton.addEventListener("click", () => {
                currentPage = i;
                displayRecipes();
            });
            paginationContainer.appendChild(pageButton);
        }
    }
}
