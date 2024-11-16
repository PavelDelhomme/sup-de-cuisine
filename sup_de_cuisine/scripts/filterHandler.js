import { displayRecipes } from './uiHandler.js';
import { allRecipes } from './dataHandler.js';

let activeFilters = { ingredients: [], appliances: [], utensils: [] };

// Remplir les filtres
export function populateFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach(recipe => {
        // Vérifiez que les champs existent avant d'ajouter au set
        if (recipe.ingredients) {
            recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        }
        if (recipe.appliance) {
            appliances.add(recipe.appliance);
        }
        if (recipe.utensils) {
            recipe.utensils.forEach(ut => utensils.add(ut));
        }
    });

    createDropdownList("ingredient-list", Array.from(ingredients), "ingredients");
    createDropdownList("appliance-list", Array.from(appliances), "appliances");
    createDropdownList("utensil-list", Array.from(utensils), "utensils");
}

// Créer une liste déroulante
function createDropdownList(elementId, items, filterType) {
    const dropdown = document.getElementById(elementId);
    dropdown.innerHTML = "";

    items.forEach(item => {
        const span = document.createElement("span");
        span.textContent = item;
        span.addEventListener("click", () => toggleFilter(filterType, item));
        dropdown.appendChild(span);
    });
}

// Ajouter/enlever un filtre
function toggleFilter(type, value) {
    if (!activeFilters[type].includes(value)) {
        activeFilters[type].push(value);
    } else {
        activeFilters[type] = activeFilters[type].filter(item => item !== value);
    }
    applyFilters();
}

// Appliquer les filtres
function applyFilters() {
    const filteredRecipes = allRecipes.filter(recipe => {
        const matchesIngredients =
            !activeFilters.ingredients.length ||
            activeFilters.ingredients.every(ing =>
                recipe.ingredients?.some(i => i.ingredient === ing)
            );

        const matchesAppliances =
            !activeFilters.appliances.length ||
            activeFilters.appliances.includes(recipe.appliance);

        const matchesUtensils =
            !activeFilters.utensils.length ||
            activeFilters.utensils.every(ut =>
                recipe.utensils?.includes(ut)
            );

        return matchesIngredients && matchesAppliances && matchesUtensils;
    });

    displayRecipes(filteredRecipes);
}
