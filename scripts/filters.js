// filters.js
import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { displaySuggestions } from "./search.js";
import { populateDropdown } from "./dropdowns.js";


export let isGlobalSearchActive = false;


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
    console.log("Filtres actifs :", selectedIngredients, selectedAppliances, selectedUtensils);

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
    console.log("Filtres appliqués :", selectedIngredients, selectedAppliances, selectedUtensils);
    console.log("Recettes après filtrage :", filteredRecipes);

    setCurrentPage(1);
    displayRecipes();
    updateAdvancedSearchFields();
}