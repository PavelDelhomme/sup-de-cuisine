// dropdowns.js
import { applyFilters } from "./filters.js";
import { filteredRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { handleSearch } from "./search.js";

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

function setupDropdown(type, dropdownId, selectedList) {
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
        if (e.target.tagName === "LI") {
            const value = e.target.textContent.trim();
            if (!selectedList.includes(value)) {
                selectedList.push(value);
                searchInput.value = ""; // Clear the input after selection
                dropdown.classList.remove("show");
                updateFilters();
                updateBadges(type, value, selectedList);
            }
        }
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && e.target !== searchInput) {
            dropdown.classList.remove("show");
        }
    });
}
/*
function setupDropdown(type, dropdownId, selectedList) {
    const searchInput = document.getElementById(`${type}-search`);
    const dropdown = document.getElementById(dropdownId);

    searchInput.addEventListener("focus", () => {
        populateDropdown(type, dropdownId, searchInput);
        toggleDropdown(dropdown, true);
    });

    searchInput.addEventListener("input", () => {
        populateDropdown(type, dropdownId, searchInput);
    });

    dropdown.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
            const value = e.target.textContent.trim();
            if (!selectedList.includes(value)) {
                selectedList.push(value);
                updateFilters();
                updateBadges(type, value, selectedList);
            }
        }
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && e.target !== searchInput) {
            toggleDropdown(dropdown, false);
        }
    });
}
*/

export function populateDropdown(type, dropdownId, searchInput) {
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



function filterDropdownOptions(query, dropdown) {
    const items = dropdown.querySelectorAll("li");
    items.forEach((item) => {
        if (item.textContent.toLowerCase().includes(query)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}


function updateFilters() {
    applyFilters(
        selectedFilters.ingredients,
        selectedFilters.appliances,
        selectedFilters.utensils
    );

    /*
    // Mettre à jour les dropdowns après l’application des filtres
    populateDropdown("ingredient", "ingredient-options", document.getElementById("ingredient-search"));
    populateDropdown("appliance", "appliance-options", document.getElementById("appliance-search"));
    populateDropdown("utensil", "utensil-options", document.getElementById("utensil-search"));
    */

    // Met à jour les recettes affichées
    displayRecipes();
    // Actualise les suggestions après chaque mise à jour
    //displaySuggestions();
}



function updateBadges(type, value, selectedList) {
    const badgeContainer = document.getElementById("selected-filters");

    if (!badgeContainer) return;

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.innerHTML = `
        <span>${value}</span>
        <span class="remove" data-type="${type}" data-value="${value}">×</span>
    `;
    
    badge.querySelector(".remove").addEventListener("click", () => {
        const index = selectedList.indexOf(value);
        if (index > -1) {
            selectedList.splice(index, 1);
            badge.remove();
            const currentQuery = document.getElementById("search-bar").value.trim();
            handleSearch(currentQuery, new Set([...selectedFilters.ingredients, ...selectedFilters.appliances, ...selectedFilters.utensils]));
            //updateFilters();
        }
    });
    
    badgeContainer.appendChild(badge);
}
