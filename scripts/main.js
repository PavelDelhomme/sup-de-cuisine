import { allRecipes, fetchRecipes, filteredRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { setupGlobalSearch, displaySuggestions, performSearch } from "./search.js";
import { setupDropdowns, closeAllDropdowns } from "./dropdowns.js";

document.addEventListener("DOMContentLoaded", async () => {
    await fetchRecipes(); // Charge les recettes
    setupGlobalSearch(); // Configure la barre de recherce
    setupDropdowns(); // Configurer les filtres
    // displayTags();
    filteredRecipes.push(...allRecipes); // Initialise les recettes filtrées
    displayRecipes(); // Affiche les recettes
    displaySuggestions(); // Basé sur toutes les recettes initiales affihe les suggestions
});

// Mise à jour des filtres actifs
document.querySelectorAll(".dropdown-input").forEach((input) => {
    input.addEventListener("input", () => {
        const query = document.getElementById("search-bar").ariaValueMax.trim();
        performSearch(query, {
            ingredients: selectedFilters.ingredients,
            appliances: selectedFilters.appliances,
            utensils: selectedFilters.utensils,
        });
    });
});

document.getElementById("search-bar").addEventListener("input", closeAllDropdowns);
