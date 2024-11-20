import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayRecipes } from "./recipes.js";

export function applyFilters(selectedIngredients, selectedAppliances, selectedUtensils) {
    filteredRecipes.length = 0;
    filteredRecipes.push(
        ...allRecipes.filter((recipe) => {
            const matchesIngredients = selectedIngredients.every((ing) =>
                recipe.ingredients.some((ri) => ri.ingredient.toLowerCase().includes(ing.toLowerCase()))
            );
            const matchesAppliances = selectedAppliances.every((app) =>
                recipe.appliance.toLowerCase().includes(app.toLowerCase())
            );
            const matchesUtensils = selectedUtensils.every((ut) =>
                recipe.ustensils.some((ust) => ust.toLowerCase().includes(ut.toLowerCase()))
            );

            return matchesIngredients && matchesAppliances && matchesUtensils;
        })
    );

    resetPagination(); // Reset pagination to page 1
    displayRecipes();
}

function resetPagination() {
    setCurrentPage(1);
}
