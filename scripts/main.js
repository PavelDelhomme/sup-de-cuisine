const JSON_URL = "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";
let allRecipes = [];
let filteredRecipes = [];
let currentPage = 1;
const recipesPerPage = 9;

// Sélections globales
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUtensils = [];

// Fonction pour récupérer les données JSON
async function fetchRecipes() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des recettes.");
        allRecipes = await response.json();
        filteredRecipes = [...allRecipes]; // Initialisation des recettes filtrées

        // Met à jour les compteurs de recettes
        updateRecipeCount();

        // Remplit les dropdowns dynamiquement
        populateDropdowns();

        // Affiche les recettes
        displayRecipes();
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Met à jour les compteurs de recettes
function updateRecipeCount() {
    const totalRecipes = allRecipes.length;
    const visibleRecipes = filteredRecipes.length;
    document.getElementById("recipe-count").textContent = `Total : ${totalRecipes} recettes | Affichées : ${visibleRecipes}`;
}

// Remplit les dropdowns dynamiquement
function populateDropdowns() {
    const allIngredients = [...new Set(allRecipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient)))];
    const allAppliances = [...new Set(allRecipes.map(recipe => recipe.appliance))];
    const allUtensils = [...new Set(allRecipes.flatMap(recipe => recipe.ustensils))];

    updateDropdownOptions(document.getElementById("ingredient-options"), allIngredients, "ingredient");
    updateDropdownOptions(document.getElementById("appliance-options"), allAppliances, "appliance");
    updateDropdownOptions(document.getElementById("utensil-options"), allUtensils, "utensil");
}

// Met à jour les options d'un dropdown
function updateDropdownOptions(dropdown, items, type) {
    dropdown.innerHTML = "";
    items.forEach(item => {
        if (!getSelectedItems(type).includes(item)) {
            const li = document.createElement("li");
            li.textContent = item;
            li.addEventListener("click", () => {
                addSelection(type, item);
            });
            dropdown.appendChild(li);
        }
    });
}

// Retourne la liste des éléments sélectionnés pour un type
function getSelectedItems(type) {
    if (type === "ingredient") return selectedIngredients;
    if (type === "appliance") return selectedAppliances;
    if (type === "utensil") return selectedUtensils;
    return [];
}

// Ajoute une sélection et met à jour l'affichage
function addSelection(type, value) {
    if (type === "ingredient") selectedIngredients.push(value);
    if (type === "appliance") selectedAppliances.push(value);
    if (type === "utensil") selectedUtensils.push(value);

    updateSelectedFilters();
    applyFilters();
    populateDropdowns(); // Met à jour les listes après sélection
}

// Met à jour les badges
function updateSelectedFilters() {
    const selectedFilters = document.getElementById("selected-filters");
    selectedFilters.innerHTML = "";

    selectedIngredients.forEach(ingredient => createBadge(ingredient, "ingredient"));
    selectedAppliances.forEach(appliance => createBadge(appliance, "appliance"));
    selectedUtensils.forEach(utensil => createBadge(utensil, "utensil"));
}

// Crée un badge pour une sélection
function createBadge(label, type) {
    const selectedFilters = document.getElementById("selected-filters");

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.innerHTML = `
        <span>${label}</span>
        <span class="remove" data-type="${type}" data-value="${label}">×</span>
    `;

    badge.querySelector(".remove").addEventListener("click", () => {
        removeSelection(type, label);
    });

    selectedFilters.appendChild(badge);
}

// Supprime une sélection
function removeSelection(type, value) {
    if (type === "ingredient") selectedIngredients = selectedIngredients.filter(item => item !== value);
    if (type === "appliance") selectedAppliances = selectedAppliances.filter(item => item !== value);
    if (type === "utensil") selectedUtensils = selectedUtensils.filter(item => item !== value);

    updateSelectedFilters();
    applyFilters();
    populateDropdowns(); // Met à jour les listes après suppression
}

// Filtre les recettes selon les sélections
function applyFilters() {
    filteredRecipes = allRecipes.filter(recipe => {
        const matchesIngredients = selectedIngredients.length === 0 || selectedIngredients.every(ing =>
            recipe.ingredients.some(ri => ri.ingredient.includes(ing))
        );
        const matchesAppliances = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance);
        const matchesUtensils = selectedUtensils.length === 0 || selectedUtensils.every(ut =>
            recipe.ustensils.includes(ut)
        );

        return matchesIngredients && matchesAppliances && matchesUtensils;
    });

    currentPage = 1;
    updateRecipeCount();
    displayRecipes();
}

// Recherche dans les dropdowns
function filterDropdown(searchInput, dropdown) {
    const value = searchInput.value.toLowerCase();
    const items = dropdown.querySelectorAll("li");

    items.forEach(item => {
        if (item.textContent.toLowerCase().includes(value)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });

    dropdown.classList.add("show");
}


// Affiche les recettes filtrées
function displayRecipes() {
    const main = document.querySelector("main");
    main.innerHTML = "";

    const start = (currentPage - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    const recipesToDisplay = filteredRecipes.slice(start, end);

    if (recipesToDisplay.length === 0) {
        main.innerHTML = "<p>Aucune recette trouvée.</p>";
        return;
    }

    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";

    recipesToDisplay.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
        const formattedIngredients = recipe.ingredients.map(ing => `
            <div class="ingredient">
                <strong>${ing.ingredient}</strong>
                <span>${ing.quantity || ""} ${ing.unit || ""}</span>
            </div>
        `).join("");

        recipeCard.innerHTML = `
            <img src="data/images/${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <h2 class="recipe-title">${recipe.name}</h2>
            <p class="section-title">Recette</p>
            <p class="recipe-description">${truncateText(recipe.description, 120)}</p>
            <p class="section-title">Ingrédients</p>
            <div class="ingredients-grid">${formattedIngredients}</div>
        `;

        gridContainer.appendChild(recipeCard);
    });

    main.appendChild(gridContainer);
    setupPagination();
}

// Fonction utilitaire pour tronquer le texte
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Affiche la pagination
function setupPagination() {
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination";
    const main = document.querySelector("main");
    main.appendChild(paginationContainer);

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? "active" : "";
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayRecipes();
        });
        paginationContainer.appendChild(pageButton);
    }
}

// Recherche en temps réel via la barre de recherche principale
function liveSearchRecipes(query) {
    const lowerCaseQuery = query.toLowerCase();

    filteredRecipes = allRecipes.filter(recipe => {
        return (
            recipe.name.toLowerCase().includes(lowerCaseQuery) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(lowerCaseQuery)) ||
            recipe.appliance.toLowerCase().includes(lowerCaseQuery) ||
            recipe.ustensils.some(ust => ust.toLowerCase().includes(lowerCaseQuery))
        );
    });

    currentPage = 1; // Réinitialiser à la première page
    updateRecipeCount(); // Met à jour le compteur
    displayRecipes(); // Affiche les recettes filtrées
}


// Gestion des événements pour la recherche principale
const searchInput = document.getElementById("search-bar");
searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    if (query.length >= 3) {
        liveSearchRecipes(query);
    }
});




// Gestion des événements de recherche dans les dropdowns
document.getElementById("ingredient-search").addEventListener("input", (e) => filterDropdown(e.target, document.getElementById("ingredient-options")));
document.getElementById("appliance-search").addEventListener("input", (e) => filterDropdown(e.target, document.getElementById("appliance-options")));
document.getElementById("utensil-search").addEventListener("input", (e) => filterDropdown(e.target, document.getElementById("utensil-options")));

// Cache les dropdowns lorsqu'on clique en dehors
document.addEventListener("click", (e) => {
    if (!e.target.matches(".dropdown-input")) {
        document.querySelectorAll(".dropdown-options").forEach(dropdown => dropdown.classList.remove("show"));
    }
});

// Initialisation
document.addEventListener("DOMContentLoaded", fetchRecipes);
