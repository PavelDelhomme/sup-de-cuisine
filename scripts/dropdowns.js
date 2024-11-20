// dropdowns.js
import { applyFilters } from "./filters.js";
import { filteredRecipes } from "./data.js";
import { displayRecipes } from "./recipes.js";

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
function populateDropdown(type, dropdownId, searchInput) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ""; // Vider les options existantes

    const options = getOptionsForType(type).filter(option =>
        option.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    console.log(`Options pour ${type} après filtrage :`, options);

    if (options.length === 0) {
        dropdown.classList.remove("show"); // Cache le dropdown si aucune option
        console.log("Aucune options pour le dropdown  de type ", type);
        return;
    }

    options.forEach((option) => {
        const li = document.createElement("li");
        li.textContent = option;
        li.classList.add("dropdown-option"); // Classe CSS pour le style des options
        dropdown.appendChild(li);
    });

    dropdown.classList.add("show"); // Affiche le dropdown avec les options
}


function getOptionsForType(type) {
    if (!filteredRecipes || filteredRecipes.length === 0) return [];

    if (type === "ingredient") return [...new Set(filteredRecipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient)))];
    if (type === "appliance") return [...new Set(filteredRecipes.map(recipe => recipe.appliance))];
    if (type === "utensil") return [...new Set(filteredRecipes.flatMap(recipe => recipe.ustensils))];
    return [];
}

function toggleDropdown(dropdown, show) {
    dropdown.style.display = show ? "block" : "none";
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

    // Mettre à jour les dropdowns
    populateDropdown("ingredient", "ingredient-options", document.getElementById("ingredient-search"));
    populateDropdown("appliance", "appliance-options", document.getElementById('appliance-search'));
    populateDropdown("utensil", "utensil-options", document.getElementById("utensil-search"));

    displayRecipes();
}


function updateBadges(type, value, selectedList) {
    const badgeContainer = document.getElementById("selected-filters");
    const badge = document.createElement("div");
    badge.className = "badge";
    badge.innerHTML = `
        <span>${value}</span>
        <span class="remove" data-type="${type}" data-value="${value}">×</span>
    `;
    badge.querySelector(".remove").addEventListener("click", () => {
        selectedList.splice(selectedList.indexOf(value), 1);
        badge.remove();
        updateFilters();
    });
    badgeContainer.appendChild(badge);
}
