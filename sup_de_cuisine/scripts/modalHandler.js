export function showRecipeModal(recipe) {
    document.getElementById("modal-title").textContent = recipe.name;
    document.getElementById("modal-image").src = `http://127.0.0.1:5500/sup_de_cuisine/images/${recipe.image}`;
    document.getElementById("modal-image").alt = recipe.name;
    document.getElementById("modal-servings").textContent = `Portions : ${recipe.servings}`;
    document.getElementById("modal-time").textContent = `Temps de préparation : ${recipe.time} minutes`;

    const ingredientsList = document.getElementById("modal-ingredients");
    ingredientsList.innerHTML = "<strong>Ingrédients :</strong>";
    recipe.ingredients.forEach(ing => {
        const ingredientRow = document.createElement("div");
        ingredientRow.classList.add("recipe-ingredients-row");

        const ingredientName = document.createElement("span");
        ingredientName.innerHTML = `<strong>${ing.ingredient}</strong>`;

        const ingredientQuantity = document.createElement("span");
        ingredientQuantity.textContent = `${ing.quantity || ''} ${ing.unit || ''}`;

        ingredientRow.appendChild(ingredientName);
        ingredientRow.appendChild(ingredientQuantity);
        ingredientsList.appendChild(ingredientRow);
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

export function closeModal() {
    document.getElementById("recipe-modal").classList.add("hidden");
    document.getElementById("recipe-modal").style.display = "none";
}
