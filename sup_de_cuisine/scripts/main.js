import { fetchRecipes } from './dataHandler.js';
import { displayRecipes } from './uiHandler.js';
import { closeModal } from './modalHandler.js';
import { populateFilters } from './filterHandler.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const recipes = await fetchRecipes();

        if (recipes.length === 0) {
            console.error("Aucune recette trouvée !");
            return;
        }

        populateFilters(recipes);
        displayRecipes(recipes);

        const searchBar = document.getElementById("search-bar");
        const searchButton = document.querySelector(".search-btn");

        searchBar.addEventListener("input", () => handleSearch(searchBar.value.toLowerCase()));
        searchButton.addEventListener("click", () => handleSearch(searchBar.value.toLowerCase()));

        document.getElementById("close-modal").addEventListener("click", closeModal);
    } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);
    }
});
