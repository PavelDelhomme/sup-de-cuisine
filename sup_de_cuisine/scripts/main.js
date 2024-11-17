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
        displayRecipes();
    } catch (error) {
        console.error("Erreur :", error);
    }
}



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
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        // Formatage des ingrédients en 2 colonnes
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
            <p class="recipe-description">${truncateText(recipe.description, 120)}</p>
            <div class="ingredients-grid">
                ${formattedIngredients.join("")}
            </div>
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


fetchRecipes();



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

fetchRecipes();