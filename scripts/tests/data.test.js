import { fetchRecipes, allRecipes } from "../scripts/data.js";

describe("Chargement des données", () => {
    test("devrait charger les recettes depuis l'API", async () => {
        const mockRecipes = [
            { name: "Recette 1", description: "Description", ingredients: [{ ingredient: "Ingrédient" }] }
        ];
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRecipes),
            })
        );

        await fetchRecipes();
        expect(global.fetch).toHaveBeenCalled();
        expect(allRecipes.length).toBe(mockRecipes.length);
    });

    test("devrait filtrer les recettes invalides", async () => {
        const mockRecipes = [
            { name: "Valid", description: "Valid", ingredients: [{}] },
            { name: "", description: "", ingredients: [] }
        ];
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRecipes),
            })
        );

        await fetchRecipes();
        expect(allRecipes.length).toBe(1);
    });
});
