import { allRecipes, fetchRecipes, filteredRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { setupGlobalSearch, displaySuggestions } from "./search.js";
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

document.getElementById("search-bar").addEventListener("input", closeAllDropdowns);
