import { filterRecipes, filteredRecipes } from "../scripts/filters.js";

describe("Filtrage des recettes", () => {
    test("devrait filtrer par recherche textuelle", () => {
        const mockRecipes = [
            { name: "Poulet rôti", description: "Délicieux poulet", ingredients: [] },
            { name: "Salade", description: "Fraîche", ingredients: [] }
        ];
        global.filteredRecipes = mockRecipes;
        const result = filterRecipes("poulet");
        expect(result.every(recipe => recipe.name.toLowerCase().includes("poulet"))).toBe(true);
    });

    test("devrait filtrer par ingrédients", () => {
        const mockRecipes = [
            { ingredients: [{ ingredient: "tomate" }] },
            { ingredients: [{ ingredient: "poulet" }] }
        ];
        global.filteredRecipes = mockRecipes;
        const result = filterRecipes("", ["tomate"], [], []);
        expect(result.every(recipe => recipe.ingredients.some(ing => ing.ingredient === "tomate"))).toBe(true);
    });
});
