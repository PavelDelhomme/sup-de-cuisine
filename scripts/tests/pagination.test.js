import { setupPagination, displayRecipes } from "../recipes.js";

jest.mock("../data.js", () => ({
    filteredRecipes: [],
    currentPage: 1,
    setCurrentPage: jest.fn((page) => {
        require("../data.js").currentPage = page;
    }),
}));

// Mock de generateRecipeCard en dehors de jest.mock
const generateMockRecipeCard = (recipe) => {
    const card = document.createElement("div");
    card.className = "recipe-card-container";
    card.innerHTML = `
        <div class="recipe-card-img">
            <img src="data/images/${recipe.image}" alt="${recipe.name}">
        </div>
        <div class="recipe-card-content">
            <h2 class="recipe-title">${recipe.name}</h2>
        </div>`;
    return card;
};

// Utilisation de jest.mock avec la fonction déclarée
jest.mock("../recipeCard.js", () => ({
    generateRecipeCard: jest.fn((recipe) => generateMockRecipeCard(recipe)),
}));

describe("Pagination", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <main>
                <div class="grid-container"></div>
            </main>
            <div id="recipe-count" class="recipe-count"></div>
            <div class="pagination"></div>
        `;
        global.filteredRecipes = Array.from({ length: 20 }, (_, i) => ({
            name: `Recette ${i + 1}`,
            description: `Description ${i + 1}`,
            ingredients: [{ ingredient: `Ingrédient ${i + 1}` }],
            image: `image_${i + 1}.jpg`,
        }));
        global.currentPage = 1; // Réinitialise la page actuelle
    });

    test("devrait afficher le bon nombre de recettes par page", () => {
        displayRecipes();
        const grid = document.querySelector(".grid-container");
        expect(grid).not.toBeNull();
        expect(grid.children).toHaveLength(9); // Vérifie que 9 recettes sont affichées
        //expect(grid.children.length).toBeLessThanOrEqual(9); // Vérifie le nombre max par page
    });

    test("devrait afficher le bon nombre de boutons pour la pagination", () => {
        displayRecipes();
        const buttons = document.querySelectorAll(".pagination button");
        expect(buttons).not.toBeNull();
        expect(buttons.length).toBe(3); // 20 recettes, 9 par page, donc 3 pages
    });

    test("devrait naviguer entre les pages via les boutons de pagination", () => {
        displayRecipes(); // Affiche les recettes et configure la pagination
    
        const buttons = document.querySelectorAll(".pagination button");
        expect(buttons.length).toBe(3); // Vérifie qu'il y a 3 boutons pour 3 pages
    
        // Simule un clic sur le bouton pour la page 2
        buttons[1].click();
    
        // Vérifie que `setCurrentPage` a bien été appelé
        expect(require("../data.js").setCurrentPage).toHaveBeenCalledWith(2);
    
        // Recharge les recettes pour simuler un changement de page
        displayRecipes();
    
        // Vérifie que la page active est maintenant la page 2
        expect(require("../data.js").currentPage).toBe(2);
    
        const grid = document.querySelector(".grid-container");
        expect(grid.children.length).toBeLessThanOrEqual(9); // Vérifie l'affichage sur la nouvelle page
    });    

    test("devrait configurer les boutons de pagination correctement", () => {
        setupPagination();
        const buttons = document.querySelectorAll(".pagination button");
        expect(buttons).not.toBeNull();
        expect(buttons.length).toBe(3); // 3 pages
    });
});

beforeEach(() => {
    const { filteredRecipes } = require("../data.js");
    filteredRecipes.length = 0; // Réinitialisez `filteredRecipes`
    filteredRecipes.push(...Array.from({ length: 20 }, (_, i) => ({
        name: `Recette ${i + 1}`,
        description: `Description ${i + 1}`,
        ingredients: [{ ingredient: `Ingrédient ${i + 1}` }],
        image: `image_${i + 1}.jpg`,
    })));

    require("../data.js").currentPage = 1;

    document.body.innerHTML = `
        <main>
            <div class="grid-container"></div>
        </main>
        <div id="recipe-count" class="recipe-count"></div>
        <div class="pagination"></div>
    `;
});
