// filters.js
import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { displaySuggestions } from "./search.js";

export function updateAdvancedSearchFields() {
    if (!filteredRecipes || filteredRecipes.length === 0) {
        console.log("Aucune recette pour mettre à jour les champs de recherche.");
        return;
    }

    const searchElements = [
        { type: "ingredient", id: "ingredient-options" },
        { type: "appliance", id: "appliance-options" },
        { type: "utensil", id: "utensil-options" }
    ];

    searchElements.forEach(({ type, id }) => {
        const searchInput = document.getElementById(`${type}-search`);
        if (searchInput) {
            populateDropdown(type, id, searchInput);
        }
    });

    if (typeof displaySuggestions === 'function') {
        displaySuggestions();
    }
}

export function applyFilters(selectedIngredients, selectedAppliances, selectedUtensils) {
    filteredRecipes.length = 0;
    const currentSearchQuery = document.getElementById("search-bar")?.value?.toLowerCase() || "";

    filteredRecipes.push(...allRecipes.filter(recipe => {
        const matchesSearch = !currentSearchQuery || 
            recipe.name.toLowerCase().includes(currentSearchQuery) ||
            recipe.description.toLowerCase().includes(currentSearchQuery) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(currentSearchQuery));

        const matchesIngredients = !selectedIngredients.length || 
            selectedIngredients.every(ing => 
                recipe.ingredients.some(ri => ri.ingredient.toLowerCase() === ing.toLowerCase())
            );

        const matchesAppliances = !selectedAppliances.length || 
            selectedAppliances.every(app => 
                recipe.appliance.toLowerCase() === app.toLowerCase()
            );

        const matchesUtensils = !selectedUtensils.length || 
            selectedUtensils.every(ut => 
                recipe.ustensils.some(ust => ust.toLowerCase() === ut.toLowerCase())
            );

        return matchesSearch && matchesIngredients && matchesAppliances && matchesUtensils;
    }));

    if (filteredRecipes.length === 0) {
        const main = document.querySelector("main");
        if (main) {
            main.innerHTML = `<p>Aucune recette ne correspond à vos critères de recherche.</p>`;
        }
    }

    setCurrentPage(1);
    displayRecipes();
    updateAdvancedSearchFields();
}
/*
import { populateDropdown } from "./dropdowns.js"; // Ajoutez cette ligne
import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayRecipes } from "./recipes.js";

export function updateAdvancedSearchFields(recipes) {
    if (!recipes || recipes.length === 0) {
        console.log("Aucune recette pour mettre à jour les champs de recherche.");
        return;
    }

    populateDropdown("ingredient", "ingredient-options", recipes);
    populateDropdown("appliance", "appliance-options", recipes);
    populateDropdown("utensil", "utensil-options", recipes);
    displaySuggestions(); // Actualise les suggestions de tags disponibles
}

export function applyFilters(selectedIngredients, selectedAppliances, selectedUtensils) {
    filteredRecipes.length = 0;

    filteredRecipes.push(
        ...allRecipes.filter((recipe) => {
            const matchesIngredients = selectedIngredients.every((ing) =>
                recipe.ingredients.some((ri) => ri.ingredient.toLowerCase() === ing.toLowerCase())
            );
            const matchesAppliances = selectedAppliances.every((app) =>
                recipe.appliance.toLowerCase() === app.toLowerCase()
            );
            const matchesUtensils = selectedUtensils.every((ut) =>
                recipe.ustensils.some((ust) => ust.toLowerCase() === ut.toLowerCase())
            );

            return matchesIngredients && matchesAppliances && matchesUtensils;
        })
    );

    if (filteredRecipes.length === 0) {
        console.log("Aucune recette ne correspond aux filtres.");
        const main = document.querySelector("main");
        main.innerHTML = `<p>Aucune recette ne correspond à vos filtres.</p>`;
    }

    setCurrentPage(1); // Réinitialise la pagination
    displayRecipes(); // Affiche les résultats filtrés
    updateAdvancedSearchFields(filteredRecipes); // Met à jour les suggestions avec les résultats filtrés
    displaySuggestions(); // Rafraîchit les suggestions dynamiques
}
*/