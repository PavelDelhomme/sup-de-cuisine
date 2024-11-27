import { filterRecipes } from "../filters.js";
import { getOptionsForType, populateDropdown } from "../dropdowns.js";

jest.mock("../dropdowns.js", () => ({
    getOptionsForType: jest.fn((type) => {
        if (type === "ingredient") return ["tomate", "poulet"];
        if (type === "appliance") return ["four"];
        if (type === "utensil") return ["couteau"];
        return [];
    }),
    populateDropdown: jest.fn(),
}));

describe("Filtrage des recettes", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <main></main>
            <div id="recipe-count"></div>
            <div class="pagination"></div>
        `;
        global.allRecipes = [
            { name: "Poulet rôti", description: "Délicieux poulet", ingredients: [{ ingredient: "tomate" }] },
            { name: "Salade", description: "Fraîche", ingredients: [{ ingredient: "laitue" }] },
        ];
        global.filteredRecipes = [];
    });

    test("devrait filtrer par recherche textuelle", () => {
        filterRecipes("poulet");
        expect(global.filteredRecipes.every((recipe) => recipe.name.toLowerCase().includes("poulet"))).toBe(true);
    });

    test("devrait filtrer par ingrédients", () => {
        filterRecipes("", ["tomate"]);
        expect(global.filteredRecipes.every((recipe) => recipe.ingredients.some((ing) => ing.ingredient === "tomate"))).toBe(true);
    });
});

afterEach(() => {
    jest.clearAllMocks(); // Nettoie tous les mocks après chaque test
});
