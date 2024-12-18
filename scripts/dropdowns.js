// dropdowns.js
import { isGlobalSearchActive } from "./filters.js";
import { filteredRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { handleSearch, addTag } from "./search.js";

const selectedFilters = {
    ingredients: [],
    appliances: [],
    utensils: [],
};

export function setupDropdowns() {
    setupDropdown("ingredient", "ingredient-options", selectedFilters.ingredients);
    setupDropdown("appliance", "appliance-options", selectedFilters.appliances);
    setupDropdown("utensil", "utensil-options", selectedFilters.utensils);
}

function setupDropdown(type, dropdownId) {
    const searchInput = document.getElementById(`${type}-search`);
    const dropdown = document.getElementById(dropdownId);
    if (!searchInput || !dropdown) return;

    // Ajout des attributs ARIA
    dropdown.setAttribute("role", "listbox");
    dropdown.setAttribute("aria-labelledby", `${type}-search`);
    searchInput.setAttribute("aria-controls", dropdownId);

    searchInput.addEventListener("focus", () => {
        populateDropdown(type, dropdownId, searchInput);
        dropdown.classList.add("show");
    });

    searchInput.addEventListener("input", () => {
        populateDropdown(type, dropdownId, searchInput);
    });

    dropdown.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêche la propagation du clic
        if (e.target.tagName === "LI") {
            const value = e.target.textContent.trim();
            
            // Marquer l'option sélectionnée
            const options = dropdown.querySelectorAll("li");
            options.forEach(option => option.setAttribute("aria-selected", "false"));
            e.target.setAttribute("aria-selected", "true");

            addTag(value); // Ajoute un tag actif
            searchInput.value = ""; // Efface l'entrée après sélection
            dropdown.classList.remove("show");
        }
    });
    
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && e.target !== searchInput) {
            dropdown.classList.remove("show");
        }
    });
    
}

export function populateDropdown(type, dropdownId, searchInput) {
    if (isGlobalSearchActive) return; // Ignore si la recherche globale est active

    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    dropdown.innerHTML = "";
    const searchValue = searchInput.value ? searchInput.value.toLowerCase() : "";
    
    const options = getOptionsForType(type)
    .filter(option => option && typeof option === 'string' && option.toLowerCase().includes(searchValue))
    .filter(option => {
        // Vérifie qu'au moins une recette correspond à cette option
        if (type === "ingredient") {
            return filteredRecipes.some(recipe => 
                recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === option.toLowerCase())
            );
        } else if (type === "appliance") {
            return filteredRecipes.some(recipe => recipe.appliance.toLowerCase() === option.toLowerCase());
        } else if (type === "utensil") {
            return filteredRecipes.some(recipe => 
                recipe.ustensils.some(ust => ust.toLowerCase() === option.toLowerCase())
            );
        }
        return false;
    });


    if (options.length === 0) {
        dropdown.classList.remove("show");
        return;
    }

    options.forEach(option => {
        const li = document.createElement("li");
        li.textContent = option;
        li.classList.add("dropdown-option");
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", "false");
        dropdown.appendChild(li);
    });

    dropdown.classList.add("show");
}


export function getOptionsForType(type) {
    if (!filteredRecipes || filteredRecipes.length === 0) return [];

    switch (type) {
        case "ingredient":
            return [...new Set(
                filteredRecipes.flatMap(recipe => 
                    recipe.ingredients
                        .filter(ing => ing && ing.ingredient)
                        .map(ing => ing.ingredient.toLowerCase())
                )
            )];
        case "appliance":
            return [...new Set(
                filteredRecipes
                    .filter(recipe => recipe && recipe.appliance)
                    .map(recipe => recipe.appliance.toLowerCase())
            )];
        case "utensil":
            return [...new Set(
                filteredRecipes.flatMap(recipe => 
                    recipe.ustensils
                        .filter(ust => ust)
                        .map(ust => ust.toLowerCase())
                )
            )];
        default:
            return [];
    }
}



export function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown-options");
    dropdowns.forEach((dropdown) => dropdown.classList.remove("show"));
}
