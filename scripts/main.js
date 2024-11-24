import { fetchRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { setupGlobalSearch, displaySuggestions } from "./search.js";
import { setupDropdowns, closeAllDropdowns } from "./dropdowns.js";

document.addEventListener("DOMContentLoaded", async () => {
    await fetchRecipes();
    setupGlobalSearch();
    setupDropdowns();
    // displayTags();
    displayRecipes();
    displaySuggestions(); // Basé sur toutes les recettes initiales
});

document.getElementById("search-bar").addEventListener("input", closeAllDropdowns);
