// dropdowns.js
import { isGlobalSearchActive } from "./filters.js";
import { filteredRecipes } from "./data.js";
import { addTag } from "./search.js";

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
        .filter(option => option && typeof option === 'string' && option.toLowerCase().includes(searchValue));

    console.log(`Options pour ${type} après filtrage :`, options);

    if (options.length === 0) {
        dropdown.classList.remove("show");
        return;
    }

    options.forEach(option => {
        const li = document.createElement("li");
        li.textContent = option;
        li.classList.add("dropdown-option");
        dropdown.appendChild(li);
    });

    dropdown.classList.add("show");
}


function getOptionsForType(type) {
    if (!filteredRecipes || filteredRecipes.length === 0) return [];

    switch (type) {
        case "ingredient":
            return [...new Set(
                filteredRecipes.flatMap((recipe) => 
                    recipe.ingredients
                        .filter((ing) => ing && ing.ingredient) // Vérifie l’existence de `ing` et `ing.ingredient`
                        .map((ing) => ing.ingredient)
                )
            )];
        case "appliance":
            return [...new Set(
                filteredRecipes
                    .filter((recipe) => recipe && recipe.appliance) // Vérifie l’existence de `recipe` et `recipe.appliance`
                    .map((recipe) => recipe.appliance)
            )];
        case "utensil":
            return [...new Set(
                filteredRecipes.flatMap((recipe) => 
                    recipe.ustensils
                        .filter((ust) => ust) // Vérifie l’existence de `ust`
                )
            )];
        default:
            return [];
    }
}

export function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown-options");
    dropdowns.forEach(dropdown => dropdown.classList.remove("show"));
}

