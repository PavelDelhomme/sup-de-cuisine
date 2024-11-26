import { generateRecipeCard } from "../recipeCard.js";


describe("Génération des cartes de recettes", () => {
    test("devrait générer une carte valide", () => {
        const recipe = {
            name: "Recette Test",
            description: "Description",
            ingredients: [{ingredient: "Ingredient", quantity: 100, unit: "g"}],
            image: "tests_test.png"
        };
        const card = generateRecipeCard(recipe);
        expect(card.querySelector(".recipe-title").textContent).toBe(recipe.name);
    });

    test("devrait tronquer les descriptions longues", () => {
        const recipe = {
            name: "Test",
            description: "A".repeat(150),
            ingredients: [],
            image: "tests_test.png",
        };
        const card = generateRecipeCard(recipe);
        const description = card.querySelector(".recipe-description").textContent;
        expect(description.length).toBeLessThanOrEqual(100);
        expect(description.endsWith("...")).toBe(true);
    });
})