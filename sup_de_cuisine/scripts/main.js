document.addEventListener("DOMContentLoaded", () => {
    fetch("data/recipes.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        allRecipes = data;
        displayRecipes(allRecipes);
    })
    .catch(error => console.error("Erreur de chargement des données :", error));

    const searchBar = document.getElementById("search-bar");
    searchBar.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        // Recherche initiale par nom et description
        let filteredRecipes = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query)
        );

        // Si aucun résultat, rechercher par ingrédients
        if (filteredRecipes.length === 0) {
            filteredRecipes = allRecipes.filter(recipe =>
                recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
            );
            console.log("Recherche par ingrédients :", filteredRecipes);
        } else {
            // Si des résultats trouvés initialement, ajouter ceux trouvés par ingrédients
            const ingredientMatches = allRecipes.filter(recipe =>
                !filteredRecipes.includes(recipe) && // Exclure déjà trouvés
                recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
            );
            console.log("Ajout des résultats par ingrédients :", ingredientMatches);
            filteredRecipes = filteredRecipes.concat(ingredientMatches);
        }
        displayRecipes(filteredRecipes);        
    });

    document.getElementById("close-modal").addEventListener("click", closeModal);

    // Fermer la modale en cliquant en dehors du contenu
    document.getElementById("recipe-modal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("recipe-modal")) {
            closeModal();
        }
    });
});

function displayRecipes(recipes) {
    const container = document.getElementById("recipes-container");
    container.innerHTML = ""; // Réinitialise l'affichage des recettes

    recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.onclick = () => showRecipeModal(recipe);

        const image = document.createElement("img");
        image.src = `data/images/${recipe.image}`;
        image.alt = recipe.name;

        const title = document.createElement("div");
        title.classList.add("recipe-title");
        title.textContent = recipe.name;

        recipeCard.appendChild(image);
        recipeCard.appendChild(title);
        container.appendChild(recipeCard);
    });
}

function showRecipeModal(recipe) {
    document.getElementById("modal-title").textContent = recipe.name;
    document.getElementById("modal-image").src = `data/images/${recipe.image}`;
    document.getElementById("modal-image").alt = recipe.name;
    document.getElementById("modal-servings").textContent = `Portions : ${recipe.servings}`;
    document.getElementById("modal-time").textContent = `Temps de préparation : ${recipe.time} minutes`;

    // Ingrédients
    const ingredientsList = document.getElementById("modal-ingredients");
    ingredientsList.innerHTML = "<strong>Ingrédients :</strong>";
    recipe.ingredients.forEach(ing => {
        const ingredientBadge = document.createElement("span");
        ingredientBadge.classList.add("ingredient-badge");
        ingredientBadge.textContent = `${ing.ingredient} - ${ing.quantity || ''} ${ing.unit || ''}`;
        ingredientsList.appendChild(ingredientBadge);
    });

    // Étapes de la recette
    const stepsList = document.getElementById("modal-description");
    stepsList.innerHTML = "<strong>Étapes :</strong>";
    
    // Séparer les étapes principales et sous-étapes
    const steps = recipe.description.split('.').filter(step => step.trim() !== "");
    const ol = document.createElement("ol");
    
    mainSteps.forEach(step => {
        if (step.trim() !== "") {
            const li = document.createElement("li"); // Main step item
            const subSteps = step.split(','); // Split by commas for sub-steps
            li.innerHTML = `<strong>${subSteps.shift().trim()}.</strong>`; // Add main step
            const ul = document.createElement("ul"); // Sub-list for sub-steps

            subSteps.forEach(subStep => {
                const subLi = document.createElement("li");
                subLi.textContent = subStep.trim();
                ul.appendChild(subLi); // Append sub-steps to the main step
            });

            li.appendChild(ul); // Append sub-list to main step
            ol.appendChild(li);
        }
    });

    stepsList.appendChild(ol); // Add list to the modal content
    document.getElementById("recipe-modal").classList.remove("hidden");
    document.getElementById("recipe-modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("recipe-modal").classList.add("hidden");
}
