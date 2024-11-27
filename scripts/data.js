export let currentPage = 1;
export let allRecipes = [];
export let filteredRecipes = [];

export function setCurrentPage(page) {
    currentPage = page;
}

export async function fetchRecipes() {
    const JSON_URL =
        "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";

    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des recettes.");
        allRecipes = await response.json();
        // Filtrez les recettes avec des données valides uniquement
        allRecipes = allRecipes.filter(
            (recipe) =>
                recipe.name &&
                recipe.description &&
                Array.isArray(recipe.ingredients) &&
                recipe.ingredients.length > 0
        );
    } catch (error) {
        console.error("Erreur :", error);
        alert("Erreur lors du chargement des recettes. Veuillez vérifier votre connexion ou réessayer.");
    }
}
