import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayRecipes } from "./recipes.js";
import { updateAdvancedSearchFields } from "./filters.js";

let activeTags = [];

export function setupGlobalSearch() {
    const searchInput = document.getElementById("search-bar");
    const tagContainer = document.getElementById("selected-filters");
    const clearButton = document.createElement("span");

    clearButton.classList.add("clear-btn");
    clearButton.textContent = "×";
    clearButton.style.display = "none";
    searchInput.parentElement.appendChild(clearButton);

    // Afficher les suggestions sur le focus
    searchInput.addEventListener("focus", () => {
        displaySuggestions(); // Affiche les suggestions
    });

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length >= 3) {
            searchWithTags(query);
        } else {
            resetRecipes();
        }

        clearButton.style.display = query || activeTags.length > 0 ? "inline" : "none";
    });

    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        activeTags = [];
        resetRecipes();
        clearButton.style.display = "none";
        tagContainer.innerHTML = "";
    });
}

export function displaySuggestions() {
    const tagsContainer = document.getElementById("tags-container");
    if (!tagsContainer) return;

    const uniqueTags = new Set();

    // Collecter les ingrédients, appareils et ustensiles des recettes filtrées
    filteredRecipes.forEach((recipe) => {
        recipe.ingredients.forEach((ing) => uniqueTags.add(ing.ingredient.toLowerCase()));
        uniqueTags.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach((ust) => uniqueTags.add(ust.toLowerCase()));
    });

    // Exclure les tags déjà actifs
    activeTags.forEach((tag) => uniqueTags.delete(tag));

    // Nettoyer l'affichage actuel des tags
    tagsContainer.innerHTML = "";

    // Limiter le nombre de tags affichés (exemple : 10 max)
    const limitedTags = Array.from(uniqueTags).slice(0, 10);

    limitedTags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.innerHTML = `<span>Ajouter le tag : <strong>${tag}</strong></span>`;
        tagElement.addEventListener("click", () => {
            addTag(tag);
        });
        tagsContainer.appendChild(tagElement);
    });

    if (uniqueTags.size > 10) {
        const moreTagElement = document.createElement("span");
        moreTagElement.className = "tag";
        moreTagElement.innerHTML = `<span>Afficher plus de tags...</span>`;
        moreTagElement.addEventListener("click", () => {
            displayMoreTags(Array.from(uniqueTags));
        });
        tagsContainer.appendChild(moreTagElement);
    }
}


function displayMoreTags(allTags) {
    const tagsContainer = document.getElementById("tags-container");
    if (!tagsContainer) return;

    tagsContainer.innerHTML = "";

    allTags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.innerHTML = `<span>Ajouter le tag : <strong>${tag}</strong></span>`;
        tagElement.addEventListener("click", () => {
            addTag(tag);
        });
        tagsContainer.appendChild(tagElement);
    });
}

function addTag(tag) {
    if (activeTags.includes(tag)) return; // Évite les doublons
    activeTags.push(tag);

    const tagContainer = document.getElementById("selected-filters");
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.innerHTML = `
        <span>${tag}</span>
        <span class="remove" data-tag="${tag}">×</span>
    `;

    badge.querySelector(".remove").addEventListener("click", () => {
        activeTags = activeTags.filter((t) => t !== tag);
        badge.remove();
        searchWithTags(document.getElementById("search-bar").value.trim().toLowerCase()); // Combine les tags actifs avec la recherche actuelle
    });

    tagContainer.appendChild(badge);
    searchWithTags(document.getElementById("search-bar").value.trim().toLowerCase()); // Met à jour avec les tags et la recherche globale
}

function searchWithTags(query = "") {
    filteredRecipes.length = 0;

    filteredRecipes.push(
        ...allRecipes.filter((recipe) => {
            const matchesQuery =
                query === "" ||
                recipe.name.toLowerCase().includes(query) ||
                recipe.ingredients.some((ing) =>
                    ing.ingredient && ing.ingredient.toLowerCase().includes(query)
                ) ||
                recipe.description.toLowerCase().includes(query);

            const matchesTags = activeTags.every((tag) => {
                return (
                    recipe.name.toLowerCase().includes(tag) ||
                    recipe.ingredients.some((ing) =>
                        ing.ingredient && ing.ingredient.toLowerCase().includes(tag)
                    ) ||
                    recipe.description.toLowerCase().includes(tag)
                );
            });

            return matchesQuery && matchesTags;
        })
    );

    // Affiche un message si aucune recette ne correspond
    if (filteredRecipes.length === 0) {
        console.log("Aucune recette ne correspond à la recherche ou aux tags.");
        const main = document.querySelector("main");
        main.innerHTML = `<p>Aucune recette ne correspond à votre recherche ou à vos tags.</p>`;
        return;
    }

    resetSearchPagination();
    displayRecipes();
    updateAdvancedSearchFields(filteredRecipes); // Met à jour les suggestions avec les résultats filtrés
    displaySuggestions(); // Actualise les suggestions des tags dynamiquement
}


function resetRecipes() {
    filteredRecipes.length = 0;
    filteredRecipes.push(...allRecipes);
    resetSearchPagination();
    displayRecipes();
    updateAdvancedSearchFields(allRecipes);
}


function searchRecipes(query) {
    if (!allRecipes || allRecipes.length === 0) return []; // Fallback si allRecipes est vide

    const results = allRecipes.filter(
        (recipe) => 
            recipe.name.toLowerCase().includes(query) ||
            recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(query)) ||
            recipe.description.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        displayNoResultsMessage(query);
    }

    return results;
}


function resetSearchPagination() {
    setCurrentPage(1);
}


function displayNoResultsMessage(query) {
    const main = document.querySelector("main");
    main.innerHTML = `
        <p>Aucune recettes ne contient "<strong>${query}</strong>".</p>
    `;
    const paginationContainer = document.querySelector(".pagination");
    if (paginationContainer) paginationContainer.innerHTML = ""; 
}

export function displayTags() {
    const tagsContainer = document.getElementById("tags-container");
    if (!tagsContainer) {
        console.warn("tags-container n'existe pas dans le DOM.");
        return;
    }

    // Extraire les ingrédients uniques des recettes
    const uniqueTags = new Set();
    allRecipes.forEach((recipe) => {
        recipe.ingredients.forEach((ing) => uniqueTags.add(ing.ingredient.toLowerCase()));
    });

    // Créer des éléments de tags
    tagsContainer.innerHTML = Array.from(uniqueTags)
        .slice(0, 20) // Limiter à 20 tags pour éviter la surcharge visuelle
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join("");

    document.querySelectorAll(".tag").forEach((tagElement) => {
        tagElement.addEventListener("click", (e) => {
            const tag = e.target.textContent.trim().toLowerCase();
            filterByTag(tag);
        });
    });
}


function filterByTag(tag) {
    // Filtrer les recettes qui contiennent l'ingrédient correspondant au tag
    const results = allRecipes.filter((recipe) =>
        recipe.ingredients.some((ing) => ing.ingredient.toLowerCase() === tag)
    );

    // Mettre à jour les recettes filtrées
    filteredRecipes.length = 0;
    filteredRecipes.push(...results);
    resetSearchPagination();
    displayRecipes();

    // Actualiser les champs de recherche avancée
    updateAdvancedSearchFields(results);
}
