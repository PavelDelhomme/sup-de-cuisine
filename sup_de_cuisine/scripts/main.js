const JSON_URL = "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";
let allRecipes = [];
let activeFilters = { ingredients: [], appliances: [], utensils: [] };
let currentPage = 1;
const recipesPerPage = 9;

// Attente des éléments nécessaires avant d'exécuter le code
function waitForElements(ids, callback) {
    let missing = ids.filter((id) => !document.getElementById(id));
    if (missing.length === 0) {
        callback();
    } else {
        console.warn("En attente des éléments suivants :", missing);
        requestAnimationFrame(() => waitForElements(ids, callback));
    }
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM complètement chargé, initialisation...");

    waitForElements(
        ["ingredient-search", "appliance-search", "utensil-search", "ingredient-list", "appliance-list", "utensil-list"],
        async () => {
            console.log("Tous les éléments sont prêts, initialisation...");
            try {
                const recipes = await fetchRecipes();
                if (recipes.length === 0) throw new Error("Aucune recette trouvée !");

                console.log("Recettes chargées :", recipes);

                console.log("Appel de populateFilters...");
                populateFilters(recipes);
                console.log("populateFilters terminé.");

                displayRecipes(recipes);

                document.getElementById("search-bar").addEventListener("input", (e) =>
                    handleSearch(e.target.value.toLowerCase())
                );
                document.querySelector(".search-btn").addEventListener("click", () =>
                    handleSearch(document.getElementById("search-bar").value.toLowerCase())
                );
                document.getElementById("close-modal").addEventListener("click", closeModal);
            } catch (error) {
                console.error("Erreur lors de l'initialisation :", error);
            }
        }
    );
});

async function fetchRecipes() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        allRecipes = await response.json();
        console.log("Recettes chargées depuis l'API :", allRecipes);

        // Ajout de validation des données
        allRecipes.forEach((recipe, index) => {
            if (!recipe.ingredients || !recipe.appliance || !recipe.utensils) {
                console.warn(`Recette ${index + 1} : données partiellement manquantes.`, recipe);
                // Optionnel : Ajouter des valeurs par défaut pour éviter d'autres erreurs.
                recipe.ingredients = recipe.ingredients || [];
                recipe.appliance = recipe.appliance || "Appareil inconnu";
                recipe.utensils = recipe.utensils || [];
            }
            
        });

        return allRecipes;
    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        return [];
    }
}


function displayRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    container.innerHTML = "";

    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToDisplay = recipes.slice(startIndex, endIndex);

    recipesToDisplay.forEach((recipe) => {
        const recipeCard = createRecipeCard(recipe);
        container.appendChild(recipeCard);
    });

    document.getElementById("recipe-count").textContent = `Nombre de recettes affichées : ${recipes.length}`;
    updatePagination(recipes.length);
}

function createRecipeCard(recipe) {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.onclick = () => showRecipeModal(recipe);

    const image = document.createElement("img");
    image.src = `http://127.0.0.1:5500/sup_de_cuisine/images/${recipe.image}`;
    image.alt = recipe.name;
    image.onerror = () => {
        image.src = "https://via.placeholder.com/200";
        console.warn(`Image introuvable : ${recipe.image}`);
    };

    const title = document.createElement("div");
    title.classList.add("recipe-title");
    title.textContent = recipe.name;

    const description = document.createElement("div");
    description.classList.add("recipe-description");
    description.textContent = `Recette : ${recipe.description.split(".")[0]}`;

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(description);
    return card;
}

function updatePagination(totalRecipes) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pagination-btn");
        if (i === currentPage) button.style.backgroundColor = "#ff5722";

        button.onclick = () => {
            currentPage = i;
            displayRecipes(allRecipes);
        };

        paginationContainer.appendChild(button);
    }
}

function showRecipeModal(recipe) {
    const modal = document.getElementById("recipe-modal");
    document.getElementById("modal-title").textContent = recipe.name;
    document.getElementById("modal-image").src = `http://127.0.0.1:5500/sup_de_cuisine/images/${recipe.image}`;
    document.getElementById("modal-image").alt = recipe.name;

    modal.classList.remove("hidden");
    modal.style.display = "flex";
    modal.scrollIntoView({ behavior: "smooth" });
}

function closeModal() {
    const modal = document.getElementById("recipe-modal");
    modal.classList.add("hidden");
    modal.style.display = "none";
}
function populateFilters(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const utensils = new Set();

    recipes.forEach((recipe) => {
        // Vérification des propriétés avant d'ajouter
        if (recipe.ingredients) {
            recipe.ingredients.forEach((ing) => {
                if (ing.ingredient) ingredients.add(ing.ingredient); // Vérifie que `ingredient` existe.
            });
        }
        if (recipe.appliance) {
            appliances.add(recipe.appliance);
        }
        if (recipe.utensils) {
            recipe.utensils.forEach((ut) => utensils.add(ut));
        }
    });

    createDropdown("ingredient-list", Array.from(ingredients), "ingredients");
    createDropdown("appliance-list", Array.from(appliances), "appliances");
    createDropdown("utensil-list", Array.from(utensils), "utensils");
}

function createDropdown(elementId, items, type) {
    const dropdown = document.getElementById(elementId);
    const input = document.getElementById(`${type}-search`);

    if (!dropdown) {
        console.error(`Élément introuvable : ${elementId}`);
    }

    if (!input) {
        console.error(`Élément introuvable : ${type}-search`);
    }

    if (!dropdown || !input) {
        console.error(`Élément manquant pour ${type} : ${elementId} ou ${type}-search`);
        return;
    }

    console.log(`Création du dropdown pour ${type}`);
    dropdown.innerHTML = "";

    items.forEach((item) => {
        const span = document.createElement("span");
        span.textContent = item;
        span.onclick = () => toggleFilter(type, item);
        dropdown.appendChild(span);
    });

    input.addEventListener("focus", () => (dropdown.style.display = "block"));
    input.addEventListener("blur", () => setTimeout(() => (dropdown.style.display = "none"), 200));
    input.addEventListener("input", (e) => {
        const filteredItems = items.filter((i) => i.toLowerCase().includes(e.target.value.toLowerCase()));
        dropdown.innerHTML = filteredItems
            .map((i) => `<span>${i}</span>`)
            .join("");
        dropdown.querySelectorAll("span").forEach((span) => {
            span.onclick = () => toggleFilter(type, span.textContent);
        });
    });
}

function toggleFilter(type, value) {
    if (!activeFilters[type].includes(value)) {
        activeFilters[type].push(value);
    } else {
        activeFilters[type] = activeFilters[type].filter((item) => item !== value);
    }
    applyFilters();
}

function applyFilters() {
    const filteredRecipes = allRecipes.filter((recipe) => {
        const matchesIngredients = activeFilters.ingredients.every((ing) =>
            recipe.ingredients?.some((i) => i.ingredient === ing)
        );
        const matchesAppliances = !activeFilters.appliances.length || activeFilters.appliances.includes(recipe.appliance);
        const matchesUtensils = activeFilters.utensils.every((ut) =>
            recipe.utensils?.includes(ut)
        );

        return matchesIngredients && matchesAppliances && matchesUtensils;
    });

    currentPage = 1;
    displayRecipes(filteredRecipes);
}

function handleSearch(query) {
    const filteredRecipes = allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some((ing) => ing.ingredient.toLowerCase().includes(query))
    );
    currentPage = 1;
    displayRecipes(filteredRecipes);
}
