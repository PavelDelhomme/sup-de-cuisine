// main.js
import { fetchRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { setupGlobalSearch } from "./search.js";
import { setupDropdowns } from "./dropdowns.js";

document.addEventListener("DOMContentLoaded", async () => {
    await fetchRecipes();
    setupGlobalSearch();
    setupDropdowns();
    displayRecipes();
});
