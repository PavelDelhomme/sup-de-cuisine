const JSON_URL = "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";
let allRecipes = [];
let filteredRecipes = [];
let currentPage = 1;
const recipesPerPage = 9;

// Fonction pour récupérer les données JSON
async function fetchRecipes() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des recettes.");
        allRecipes = await response.json();
        filteredRecipes = [...allRecipes]; // Initialisation des recettes filtrées

        // Met à jour le compteur de recettes
        document.getElementById("recipe-count").textContent = `Total : ${allRecipes.length} recettes`;

        // Remplit les dropdowns dynamiquement
        populateDropdowns();

        // Affiche les recettes
        displayRecipes();
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Fonction de filtrage dynamique
function filterRecipes() {
    const ingredientValue = document.getElementById("ingredient-filter").value.toLowerCase();
    const applianceValue = document.getElementById("appliance-filter").value.toLowerCase();
    const utensilValue = document.getElementById("utensil-filter").value.toLowerCase();

    filteredRecipes = allRecipes.filter(recipe => {
        const matchesIngredients = recipe.ingredients.some(ing =>
            ing.ingredient.toLowerCase().includes(ingredientValue)
        );
        const matchesAppliance = recipe.appliance.toLowerCase().includes(applianceValue);
        const matchesUtensils = recipe.ustensils.some(ust =>
            ust.toLowerCase().includes(utensilValue)
        );

        return matchesIngredients && matchesAppliance && matchesUtensils;
    });

    currentPage = 1; // Réinitialiser la pagination
    displayRecipes();
}


function updateSelectedFilters() {
    const selectedFilters = document.getElementById("selected-filters");
    selectedFilters.innerHTML = ""; // Réinitialise les badges

    const selectedIngredients = Array.from(document.getElementById("ingredient-select").selectedOptions).map(opt => opt.value);
    const selectedAppliances = Array.from(document.getElementById("appliance-select").selectedOptions).map(opt => opt.value);
    const selectedUtensils = Array.from(document.getElementById("utensil-select").selectedOptions).map(opt => opt.value);

    // Crée les badges pour les ingrédients
    selectedIngredients.forEach(ingredient => createBadge(ingredient, "ingredient"));

    // Crée les badges pour les appareils
    selectedAppliances.forEach(appliance => createBadge(appliance, "appliance"));

    // Crée les badges pour les ustensiles
    selectedUtensils.forEach(utensil => createBadge(utensil, "utensil"));
}

// Crée un badge
function createBadge(label, type) {
    const selectedFilters = document.getElementById("selected-filters");

    const badge = document.createElement("div");
    badge.className = "badge";

    badge.innerHTML = `
        <span>${label}</span>
        <span class="remove" data-type="${type}" data-value="${label}">×</span>
    `;

    selectedFilters.appendChild(badge);

    // Ajoute un événement pour supprimer le filtre
    badge.querySelector(".remove").addEventListener("click", (e) => {
        removeFilter(type, label);
    });
}

// Supprime un filtre
function removeFilter(type, value) {
    const selectElement = document.getElementById(`${type}-select`);
    const options = Array.from(selectElement.options);

    options.forEach(option => {
        if (option.value === value) {
            option.selected = false;
        }
    });

    applyFilters(); // Applique les filtres après suppression
    updateSelectedFilters(); // Met à jour les badges
}


// Événements pour les inputs de filtre
document.addEventListener("DOMContentLoaded", () => {
    const ingredientSelect = document.getElementById("ingredient-select");
    const applianceSelect = document.getElementById("appliance-select");
    const utensilSelect = document.getElementById("utensil-select");

    if (ingredientSelect) ingredientSelect.addEventListener("change", applyFilters);
    if (applianceSelect) applianceSelect.addEventListener("change", applyFilters);
    if (utensilSelect) utensilSelect.addEventListener("change", applyFilters);

    fetchRecipes();
});



// Fonction pour afficher les recettes
function displayRecipes() {
    const main = document.querySelector("main");
    main.innerHTML = ""; // Réinitialiser l'affichage

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
        console.log("Image Path:", `data/images/${recipe.image}`);
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
    
        const formattedIngredients = recipe.ingredients.map(ing => {
            const quantity = `${ing.quantity || ""} ${ing.unit || ""}`.trim();
            return `
                <div class="ingredient">
                    <strong>${ing.ingredient}</strong>
                    <span>${quantity}</span>
                </div>
            `;
        });
    
        recipeCard.innerHTML = `
            <img src="data/images/${recipe.image}" alt="${recipe.name}" class="recipe-image">
            <h2 class="recipe-title">${recipe.name}</h2>
            <p class="section-title">Recette</p>
            <p class="recipe-description">${truncateText(recipe.description, 120)}</p>
            <p class="section-title">Ingrédients</p>
            <div class="ingredients-grid">${formattedIngredients.join("")}</div>
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



// Fonction de recherche
function searchRecipes(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredRecipes = allRecipes.filter(recipe => {
        return (
            recipe.name.toLowerCase().includes(lowerKeyword) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(lowerKeyword)) ||
            recipe.appliance.toLowerCase().includes(lowerKeyword) ||
            recipe.ustensils.some(ust => ust.toLowerCase().includes(lowerKeyword))
        );
    });

    currentPage = 1; // Réinitialiser à la première page
    displayRecipes(); // Afficher les résultats filtrés
}

// Gestion de l'événement sur la barre de recherche
const searchInput = document.querySelector("#search-bar");
searchInput.addEventListener("input", (event) => {
    const keyword = event.target.value;
    searchRecipes(keyword);
});


// Fonction pour afficher la pagination
function setupPagination() {
    const main = document.querySelector("main");
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    const pagination = document.createElement("div");
    pagination.className = "pagination";

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? "active" : "";
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayRecipes();
        });

        pagination.appendChild(pageButton);
    }

    main.appendChild(pagination);
}

function populateDropdowns() {
    console.log("All Recipes:", allRecipes); // Vérifie si les recettes sont bien récupérées

    const ingredientSelect = document.getElementById("ingredient-select");
    const applianceSelect = document.getElementById("appliance-select");
    const utensilSelect = document.getElementById("utensil-select");

    ingredientSelect.innerHTML = "";
    applianceSelect.innerHTML = "";
    utensilSelect.innerHTML = "";

    const allIngredients = [...new Set(allRecipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient)))];
    const allAppliances = [...new Set(allRecipes.map(recipe => recipe.appliance))];
    const allUtensils = [...new Set(allRecipes.flatMap(recipe => recipe.ustensils))];

    console.log("Ingredients:", allIngredients);
    console.log("Appliances:", allAppliances);
    console.log("Utensils:", allUtensils);

    allIngredients.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient;
        option.textContent = ingredient;
        ingredientSelect.appendChild(option);
    });

    allAppliances.forEach(appliance => {
        const option = document.createElement("option");
        option.value = appliance;
        option.textContent = appliance;
        applianceSelect.appendChild(option);
    });

    allUtensils.forEach(utensil => {
        const option = document.createElement("option");
        option.value = utensil;
        option.textContent = utensil;
        utensilSelect.appendChild(option);
    });
}

function applyFilters() {
    const selectedIngredients = Array.from(document.getElementById("ingredient-select").selectedOptions).map(opt => opt.value.toLowerCase());
    const selectedAppliances = Array.from(document.getElementById("appliance-select").selectedOptions).map(opt => opt.value.toLowerCase());
    const selectedUtensils = Array.from(document.getElementById("utensil-select").selectedOptions).map(opt => opt.value.toLowerCase());

    filteredRecipes = allRecipes.filter(recipe => {
        const matchesIngredients = selectedIngredients.length === 0 || selectedIngredients.every(ing =>
            recipe.ingredients.some(ri => ri.ingredient.toLowerCase().includes(ing))
        );
        const matchesAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance.toLowerCase());
        const matchesUtensils = selectedUtensils.length === 0 || selectedUtensils.every(ut =>
            recipe.ustensils.some(ru => ru.toLowerCase().includes(ut))
        );

        return matchesIngredients && matchesAppliance && matchesUtensils;
    });

    currentPage = 1;
    displayRecipes();
    updateSelectedFilters(); // Met à jour les badges après application des filtres
}

