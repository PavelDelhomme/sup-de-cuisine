import { generateRecipeCard } from "../recipeCard.js";

describe("Génération des cartes de recettes", () => {
    beforeEach(() => {
        document.body.innerHTML = `<main></main>`;
    });

    test("devrait générer une carte valide", () => {
        const recipe = {
            name: "Recette Test",
            description: "Description",
            ingredients: [{ ingredient: "Ingredient", quantity: 100, unit: "g" }],
            image: "tests_test.png",
        };

        const card = generateRecipeCard(recipe);
        expect(card).not.toBeNull();
        expect(card.querySelector(".recipe-title").textContent).toBe(recipe.name);
    });
});

afterEach(() => {
    jest.clearAllMocks();
});
