const JSON_URL = "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";

let allRecipes = [];
let currentPage = 1;
const recipesPerPage = 9;

document.addEventListener("DOMContentLoaded", () => {
    // Charger les données depuis l'URL
    fetch(JSON_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allRecipes = data;
            displayRecipes(allRecipes);
        })
        .catch(error => console.error("Erreur de chargement des données :", error));

    // Gérer la recherche
    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filteredRecipes = filterRecipes(query);
        displayRecipes(filteredRecipes);
    });

    // Gérer la fermeture de la modale
    document.getElementById("close-modal").addEventListener("click", closeModal);
    document.getElementById("recipe-modal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("recipe-modal")) {
            closeModal();
        }
    });
});

// Fonction pour filtrer les recettes en fonction de la recherche
function filterRecipes(query) {
    return allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
    );
}

function displayRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    container.innerHTML = "";

    // Pagination
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const recipesToDisplay = recipes.slice(startIndex, endIndex);

    recipesToDisplay.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        
        const image = document.createElement("img");
        // Chemin correct vers les images
        image.src = `http://127.0.0.1:5500/sup_de_cuisine/images/${recipe.image}`;
        image.alt = recipe.name;
        image.onerror = () => {
            image.src = "https://via.placeholder.com/200"; // Image par défaut si introuvable
            console.warn(`Image introuvable : http://127.0.0.1:5500/sup_de_cuisine/images/${recipe.image}`);
        };

        const title = document.createElement("div");
        title.classList.add("recipe-title");
        title.textContent = recipe.name;
        
        const description = document.createElement("div");
        description.classList.add("recipe-description");
        description.textContent = `Recette : ${recipe.description.split('.').slice(0, 1).join('.')}`;

        const ingredients = document.createElement("div");
        ingredients.classList.add("recipe-ingredients");
        ingredients.innerHTML = `<strong>Ingrédients :</strong>`;
        recipe.ingredients.forEach(ing => {
            const ingredientText = document.createElement("p");
            ingredientText.innerHTML = `<strong>${ing.ingredient}</strong><br>${ing.quantity || ''} ${ing.unit || ''}`.trim();
            ingredients.appendChild(ingredientText);
        });

        recipeCard.appendChild(image);
        recipeCard.appendChild(title);
        recipeCard.appendChild(description);
        recipeCard.appendChild(ingredients);
        container.appendChild(recipeCard);
    });

    document.getElementById("recipe-count").textContent = `Nombre de recettes affichées : ${recipesToDisplay.length}`;
    updatePagination(recipes.length);
}


function updatePagination(totalRecipes) {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) {
        const newPagination = document.createElement("div");
        newPagination.classList.add("pagination");
        document.body.appendChild(newPagination);
    }

    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            displayRecipes(allRecipes);
        };
        if (i === currentPage) {
            button.style.backgroundColor = "#ff5722";
        }
        pagination.appendChild(button);
    }
}
function showRecipeModal(recipe) {
    document.getElementById("modal-title").textContent = recipe.name;
    // Chemin correct vers l'image de la recette
    document.getElementById("modal-image").src = `http://127.0.0.1:5500/sup_de_cuisine/images/${recipe.image}`;
    document.getElementById("modal-image").alt = recipe.name;
    document.getElementById("modal-servings").textContent = `Portions : ${recipe.servings}`;
    document.getElementById("modal-time").textContent = `Temps de préparation : ${recipe.time} minutes`;

    const ingredientsList = document.getElementById("modal-ingredients");
    ingredientsList.innerHTML = "<strong>Ingrédients :</strong>";
    recipe.ingredients.forEach(ing => {
        const ingredientBadge = document.createElement("span");
        ingredientBadge.classList.add("ingredient-badge");
        ingredientBadge.textContent = `${ing.ingredient} - ${ing.quantity || ''} ${ing.unit || ''}`.trim();
        ingredientsList.appendChild(ingredientBadge);
    });

    const stepsList = document.getElementById("modal-description");
    stepsList.innerHTML = "<strong>Étapes :</strong>";

    const steps = recipe.description.split('.').filter(step => step.trim() !== "");
    const ol = document.createElement("ol");

    steps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step.trim();
        ol.appendChild(li);
    });

    stepsList.appendChild(ol);
    document.getElementById("recipe-modal").classList.remove("hidden");
    document.getElementById("recipe-modal").style.display = "flex";
}



// Fonction pour fermer la modale
function closeModal() {
    document.getElementById("recipe-modal").classList.add("hidden");
    document.getElementById("recipe-modal").style.display = "none";
}
