// filters.js
import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayNoResultsMessage, displayRecipes } from "./recipes.js";
import { displaySuggestions } from "./search.js";
import { populateDropdown, getOptionsForType } from "./dropdowns.js";


export let isGlobalSearchActive = false;

export function setGlobalSearchActive(status) {
    isGlobalSearchActive = status;
}

export function updateAdvancedSearchFields() {
    if (isGlobalSearchActive) return;
    
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
        if (searchInput && searchInput === document.activeElement) {
            populateDropdown(type, id, searchInput);
        }
    });

    if (typeof displaySuggestions === 'function') {
        displaySuggestions();
    }
}
export function applyFilters(selectedIngredients, selectedAppliances, selectedUtensils) {
    const currentSearchQuery = document.getElementById("search-bar").value.trim();
    if (!filterRecipes || filteredRecipes.length === 0) {
        console.error("Aucune recettes filtrée trouvée.");
        displayNoResultsMessage();
        return;
    }
    filterRecipes(currentSearchQuery, selectedIngredients, selectedAppliances, selectedUtensils);
}



export function filterRecipes(query = "", selectedIngredients = [], selectedAppliances = [], selectedUtensils = []) {
    if (!Array.isArray(allRecipes)) return; // Assurez-vous que `allRecipes` est un tableau valide
    // Réinitialisation des recettes filtrées
    filteredRecipes.length = 0;

    const searchQuery = query.toLowerCase();

    // Filtrage des recettes
    filteredRecipes.push(...allRecipes.filter(recipe => {
        const matchesQuery = 
            !searchQuery ||
            recipe.name.toLowerCase().includes(searchQuery) ||
            recipe.description.toLowerCase().includes(searchQuery) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchQuery));

        const matchesIngredients = 
            !selectedIngredients.length || 
            selectedIngredients.every(ing =>
                recipe.ingredients.some(recipeIng => recipeIng.ingredient.toLowerCase() === ing.toLowerCase())
            );

        const matchesAppliances = 
            !selectedAppliances.length ||
            selectedAppliances.some(app => recipe.appliance.toLowerCase() === app.toLowerCase());

        const matchesUtensils = 
            !selectedUtensils.length ||
            selectedUtensils.every(ut =>
                recipe.ustensils.some(ust => ust.toLowerCase() === ut.toLowerCase())
            );

        return matchesQuery && matchesIngredients && matchesAppliances && matchesUtensils;
    }));

    // Met à jour les recettes affichées
    setCurrentPage(1);
    displayRecipes();

    
    // Mettre à jour les options des dropdowns après filtrage
    populateDropdown("ingredient", "ingredient-options", document.getElementById("ingredient-search"));
    populateDropdown("appliance", "appliance-options", document.getElementById("appliance-search"));
    populateDropdown("utensil", "utensil-options", document.getElementById("utensil-search"));
}
