// search.js
import { allRecipes, filteredRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";

export function setupGlobalSearch() {
    const searchInput = document.getElementById("search-bar");
    const suggestionsContainer = document.createElement("ul");
    suggestionsContainer.classList.add("suggestions");
    searchInput.parentElement.appendChild(suggestionsContainer);

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
            updateSuggestions(results, suggestionsContainer);
            displayRecipes();
            clearButton.style.display = "inline";
        } else {
            suggestionsContainer.innerHTML = "";
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
    return allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(query))
    );
}

function updateSuggestions(results, container) {
    container.innerHTML = "";
    results.slice(0, 5).forEach((recipe) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.innerHTML = `
            <img src="data/images/${recipe.image}" alt="${recipe.name}" class="suggestion-image">
            <span>${recipe.name}</span>
        `;
        container.appendChild(suggestionItem);
    });
}

function resetRecipes() {
    filteredRecipes.length = 0;
    filteredRecipes.push(...allRecipes);
    displayRecipes();
}
