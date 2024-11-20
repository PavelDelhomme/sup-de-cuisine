import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayRecipes } from "./recipes.js";

export function setupGlobalSearch() {
    const searchInput = document.getElementById("search-bar");
    const clearButton = document.createElement("span");
    clearButton.classList.add("clear-btn");
    clearButton.textContent = "×";
    clearButton.style.display = "none";
    searchInput.parentElement.appendChild(clearButton);

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length >= 3) {
            const results = searchRecipes(query);
            filteredRecipes.length = 0;
            filteredRecipes.push(...results);
            resetPagination();
            displayRecipes();
            clearButton.style.display = "inline";
        } else {
            resetRecipes();
            clearButton.style.display = "none";
        }
    });

    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        resetRecipes();
        clearButton.style.display = "none";
    });
}

function searchRecipes(query) {
    if (!allRecipes || allRecipes.length === 0) return []; // Fallback si allRecipes est vide

    return allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(query))
    );
}

function resetRecipes() {
    filteredRecipes.length = 0;
    filteredRecipes.push(...allRecipes);
    resetPagination();
    displayRecipes();
}

function resetPagination() {
    setCurrentPage(1);
}