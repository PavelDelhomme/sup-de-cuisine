export const JSON_URL = "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";
export let allRecipes = [];

// Charger les données depuis l'URL
export async function fetchRecipes() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        allRecipes = await response.json();
        return allRecipes;
    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        return [];
    }
}

// Filtrer les recettes en fonction d'une recherche
export function filterRecipes(query) {
    return allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(query))
    );
}
