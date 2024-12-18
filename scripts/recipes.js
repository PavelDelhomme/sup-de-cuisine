import { filteredRecipes, setCurrentPage, currentPage } from "./data.js";
import { generateRecipeCard } from "./recipeCard.js";

const recipesPerPage = 9;

export function displayRecipes() {
    if (!Array.isArray(filteredRecipes) || filteredRecipes.length === 0) { // Vérifie si c'est un tableau valide
        displayNoResultsMessage();
        return;
    }

    const main = document.querySelector("main");
    const recipeCount = document.getElementById("recipe-count");
    const paginationContainer = document.querySelector(".pagination");

    if (!main || !recipeCount) {
        console.error("Erreur : Elément DOM introuvable");
        return;
    }

    // Réinitialiser le contenu principal
    main.innerHTML = "";

    // Calcul des indices de pagination
    const start = (currentPage - 1) * recipesPerPage;
    const end = start + recipesPerPage;
    const recipesToDisplay = filteredRecipes.slice(start, end);

    // Mise à jour du compteur de recettes
    recipeCount.textContent = `Total : ${filteredRecipes.length} recettes`;

    // Gestion des cas où aucune recette n'est trouvée
    if (recipesToDisplay.length === 0) {
        main.innerHTML = `<p>Aucune recette ne correspond à votre recherche. Essayez d'autres termes ou critères.</p>`;
        if (paginationContainer) paginationContainer.innerHTML = "";
        return;
    }

    // Création de la grille de cartes
    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";

    // Utilisation de `generateRecipeCard` pour chaque recette
    recipesToDisplay.forEach((recipe) => {
        const recipeCard = generateRecipeCard(recipe);
        gridContainer.appendChild(recipeCard);
    });

    // Ajout de la grille au DOM
    main.appendChild(gridContainer);

    // Mise en place de la pagination
    setupPagination();
}

export function setupPagination() {
    const paginationContainer = document.querySelector(".pagination") || document.createElement("div");
    paginationContainer.className = "pagination";
    const main = document.querySelector("main");
    if (!document.querySelector(".pagination")) main.appendChild(paginationContainer);

    // Réinitialiser les boutons de pagination
    paginationContainer.innerHTML = "";

    // Vérifier que des recettes sont disponibles
    if (!Array.isArray(filteredRecipes) || filteredRecipes.length === 0) {
        console.error("Aucune recette disponible pour la pagination.");
        return;
    }

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    if (!currentPage || currentPage < 1 || currentPage > totalPages) {
        console.warn(`'currentPage' invalide (${currentPage}). Réinitialisé à 1.`);
        currentPage = 1;
    }
    
    //console.log("Total pages:", totalPages);

    // Génération des boutons de pagination si nécessaire
    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? "active" : "";
            pageButton.addEventListener("click", () => {
                setCurrentPage(i);
                displayRecipes();
            });
            paginationContainer.appendChild(pageButton);
        }
    }
}


export function displayNoResultsMessage(query = "") {
    const main = document.querySelector("main");
    const paginationContainer = document.querySelector(".pagination");

    // Réinitialiser le contenu principal
    main.innerHTML = "";

    // Afficher un message d'erreur
    main.innerHTML = `
        <p>
            ${query 
                ? `Aucune recette ne correspond à votre recherche pour "<strong>${query}</strong>".`
                : "Aucune recette ne correspond à vos critères de recherche."
            }
        </p>
    `;

    // Cacher la pagination
    if (paginationContainer) {
        paginationContainer.innerHTML = "";
    }
}


export function resetPagination() {
    setCurrentPage(1); // Réinitialiser à la première page
    setupPagination();
}
