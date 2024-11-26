import { filterRecipes } from "../filters.js";
import { getOptionsForType } from "../dropdowns.js";

jest.mock("../dropdowns.js", () => ({
    getOptionsForType: jest.fn((type) => {
        if (type === "ingredient") return ["tomate", "poulet"];
        if (type === "appliance") return ["four"];
        if (type === "utensil") return ["couteau"];
        return [];
    }),
}));

describe("Filtrage des recettes", () => {
    beforeEach(() => {
        global.allRecipes = [
            { name: "Poulet rôti", description: "Délicieux poulet", ingredients: [{ ingredient: "tomate" }] },
            { name: "Salade", description: "Fraîche", ingredients: [{ ingredient: "laitue" }] },
        ];
    });

    test("devrait filtrer par recherche textuelle", () => {
        const result = filterRecipes("poulet");
        expect(result.every((recipe) => recipe.name.toLowerCase().includes("poulet"))).toBe(true);
    });

    test("devrait filtrer par ingrédients", () => {
        const result = filterRecipes("", ["tomate"], [], []);
        expect(result.every((recipe) => recipe.ingredients.some((ing) => ing.ingredient === "tomate"))).toBe(true);
    });
});
