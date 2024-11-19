export let allRecipes = [];
export let filteredRecipes = [];

export async function fetchRecipes() {
    const JSON_URL =
        "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";

    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error("Erreur lors du chargement des recettes.");
        allRecipes = await response.json();
        filteredRecipes.push(...allRecipes);
    } catch (error) {
        console.error("Erreur :", error);
    }
}
