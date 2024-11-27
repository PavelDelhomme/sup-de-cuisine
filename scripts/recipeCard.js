export function generateRecipeCard(recipe) {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card-container";
    recipeCard.setAttribute("tabindex", "0"); // Navigation au clavier
    recipeCard.setAttribute("role", "button");
    recipeCard.setAttribute("aria-label", `Voir les détails de la recette : ${recipe.name || "Recette sans nom"}`);

    // Gestion des données manquantes (image et description)
    const defaultImage = "data/images/default.jpg";
    const imageSection = `
        <div class="recipe-card-img">
            <img src="${recipe.image ? `data/images/${recipe.image}` : defaultImage}" alt="${recipe.name || "Image par défaut"}">
            <div class="overlay">Voir plus</div>
        </div>`;

    const contentSection = `
        <div class="recipe-card-content">
            <h2 class="recipe-title">${recipe.name || "Nom non disponible"}</h2>
            <p class="recipe-subtitle">RECETTE</p>
            <p class="recipe-description">${recipe.description ? truncateText(recipe.description, 120) : "Description non disponible."}</p>
            <p class="ingredients-title">INGRÉDIENTS</p>
            <div class="ingredients-list">
                ${recipe.ingredients && recipe.ingredients.length
                    ? recipe.ingredients
                          .map((ing) =>
                              `<div class="ingredient">
                                  <strong>${ing.ingredient || "Ingrédient inconnu"}</strong>
                                  <span class="ingredient-quantity">${formatQuantity(ing.quantity, ing.unit)}</span>
                              </div>`
                          )
                          .join("")
                    : "<p>Aucun ingrédient disponible.</p>"}
            </div>
        </div>`;

    recipeCard.innerHTML = `${imageSection}${contentSection}`;
    return recipeCard;
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

function formatQuantity(quantity, unit) {
    if (!quantity) return "";
    const formattedUnit = unit === "grammes" ? "g" : unit || "";
    return `${quantity} ${formattedUnit}`;
}
