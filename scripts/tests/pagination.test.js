import { setupPagination, displayRecipes } from "../recipes.js";

describe("Pagination", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <main>
                <div class="grid-container"></div>
            </main>
            <div class="pagination"></div>
        `;
    });

    test("devrait afficher le bon nombre de recettes par page", () => {
        global.filteredRecipes = Array(20).fill({ name: "Recette" });
        displayRecipes();
        const grid = document.querySelector(".grid-container");
        expect(grid.children.length).toBeLessThanOrEqual(9);
    });

    test("devrait afficher le bon nombre de boutons pour la pagination", () => {
        global.filteredRecipes = Array(20).fill({});
        setupPagination();
        const buttons = document.querySelectorAll(".pagination button");
        expect(buttons.length).toBe(Math.ceil(20 / 9));
    });
});
