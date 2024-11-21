export function generateRecipeCard(recipe) {
    const recipeCard = document.createElement("div");
    recipeCard.className = "recipe-card-container";

    const imageSection = `
        <div class="recipe-card-img">
            <img src="data/images/${recipe.image}" alt="${recipe.name}">
            <div class="overlay">Voir plus</div>
        </div>`;

    
        const contentSection = `
        <div class="recipe-card-content">
            <h2 class="recipe-title">${recipe.name}</h2>
            <p class="recipe-subtitle">RECETTE</p>
            <p class="recipe-description">${truncateText(recipe.description, 120)}</p>
            <p class="ingredients-title">INGRÉDIENTS</p>
            <div class="ingredients-list">
                ${recipe.ingredients
                    .map((ing) =>
                        `<div class="ingredient">
                            <strong>${ing.ingredient}</strong>
                            <span class="ingredient-quantity">${formatQuantity(ing.quantity, ing.unit)}</span>
                        </div>`
                    )
                    .join("")}
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
