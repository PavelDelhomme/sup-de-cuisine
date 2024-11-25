import { allRecipes, filteredRecipes, setCurrentPage } from "./data.js";
import { displayRecipes, displayNoResultsMessage } from "./recipes.js";
import { updateAdvancedSearchFields, setGlobalSearchActive } from "./filters.js";

let activeTags = new Set();


export function setupGlobalSearch() {
    const searchInput = document.getElementById("search-bar");
    const tagsContainer = document.getElementById("tags-container");
    const clearSearchButton = document.getElementById("clear-search"); // Nouveau bouton pour effacer
    const selectedTagsContainer = document.getElementById("selected-filters");
    
    let activeTags = new Set();

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();

        setGlobalSearchActive(true);
        if (query.length >= 3) {
            updateSuggestions(query, activeTags);
        }
        
        handleSearch(query, activeTags);
        

        // Gérer l'affichage du bouton d'effacement
        clearSearchButton.classList.toggle("visible", query.length > 0);
        
        setGlobalSearchActive(false); // Désactive après la recherche
    });

    clearSearchButton.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchButton.classList.remove("visible");
        
        // Réappliquer uniquement les filtres actifs sans recherche
        handleSearch("", activeTags);
    })

    tagsContainer.addEventListener("click", (e) => {
        const tagElement = e.target.closest(".tag");
        if (tagElement) {
            const tagText = tagElement.dataset.value;
            addTag(tagText); // Ajoute le tag
        }
    });
}



function createTagElement(text, onRemove) {
    const tag = document.createElement("div");
    tag.className = "active-tag";
    tag.innerHTML = `
        <span class="tag-text">${text}</span>
        <button class="tag-remove">×</button>
    `;
    tag.querySelector(".tag-remove").addEventListener("click", () => {
        tag.remove();
        onRemove();
    });
    return tag;
}

function updateSuggestions(query, activeTags) {
    const tagsContainer = document.getElementById("tags-container");
    tagsContainer.innerHTML = "";

    const suggestions = getAllSuggestions()
        .filter(tag => !activeTags.has(tag))
        .filter(tag => tag.toLowerCase().includes(query.toLowerCase()));

    suggestions.forEach(tag => {
        const tagElement = document.createElement("div");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagElement.addEventListener("click", () => {
            addTag(tag); // Ajouter le tag en cliquant sur la suggestion
        });
        tagsContainer.appendChild(tagElement);
    });
}


export function handleSearch(query = "", activeTags = new Set()) {
    console.log("Requête de recherche :", query);
    console.log("Tags actifs :", Array.from(activeTags));
    console.log("Recettes initiales :", allRecipes);

    filteredRecipes.length = 0;

    
    filteredRecipes.push(
        ...allRecipes.filter((recipe) => {
            // Vérifier si le texte de recherche correspond
            const matchesQuery =
                query === "" ||
                recipe.name?.toLowerCase().includes(query.toLowerCase()) ||
                recipe.description?.toLowerCase().includes(query.toLowerCase()) ||
                recipe.ingredients.some((ing) =>
                    ing.ingredient.toLowerCase().includes(query.toLowerCase())
                );

            // Vérifier si tous les tags actifs correspondent
            const matchesTags = Array.from(activeTags).every((tag) => {
                return (
                    recipe.name?.toLowerCase().includes(tag.toLowerCase()) ||
                    recipe.description?.toLowerCase().includes(tag.toLowerCase()) ||
                    recipe.ingredients.some((ing) =>
                        ing.ingredient.toLowerCase().includes(tag.toLowerCase())
                    )
                );
            });

            return matchesQuery && matchesTags;
        })
    );


    
    if (filteredRecipes.length === 0) {
        displayNoResultsMessage(query);
    } else {
        displayRecipes(); // Met à jour les recettes affichées
        updateAdvancedSearchFields(filteredRecipes); // Met à jour les champs de recherche avancée
    }

    displaySuggestions(); // Met à jour les suggestions de tags
}



export function addTag(tagText) {
    if (!tagText || typeof tagText !== "string") return; // Validation

    tagText = tagText.trim().toLowerCase();
    if (activeTags.has(tagText)) return; // Pas de doublons

    activeTags.add(tagText);
    updateActiveTagsDisplay();
    handleSearch(document.getElementById("search-bar").value.trim(), activeTags);
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

    // Ajout d'un bouton pour revenir à la vue limitée
    const backButton = document.createElement("span");
    backButton.className = "tag back";
    backButton.innerHTML = `<span>Revenir...</span>`;
    backButton.addEventListener("click", displaySuggestions);
    tagsContainer.appendChild(backButton);
}


function updateActiveTagsDisplay() {
    const selectedTagsContainer = document.getElementById("selected-filters");
    selectedTagsContainer.innerHTML = ""; // Vide les tags affichés

    activeTags.forEach((tag) => {
        const tagElement = createTagElement(tag, () => {
            activeTags.delete(tag); // Supprime le tag
            updateActiveTagsDisplay(); // Met à jour l'affichage
            handleSearch(document.getElementById("search-bar").value.trim(), activeTags); // Relance la recherche
        });
        selectedTagsContainer.appendChild(tagElement);
    });
}




function resetSearchPagination() {
    setCurrentPage(1);
    displayRecipes();
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


export function getAllSuggestions() {
    const allTags = new Set();

    // Ajoutez les ingrédients
    allRecipes.forEach((recipe) => {
        recipe.ingredients.forEach((ing) => allTags.add(ing.ingredient.toLowerCase()));
        allTags.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach((ust) => allTags.add(ust.toLowerCase()));
    });

    return Array.from(allTags);
}
