import "@testing-library/jest-dom";

// Simule un DOM global minimal pour les tests
const dom = `
    <main>
        <div class="grid-container"></div>
    </main>
    <div id="recipe-count" class="recipe-count"></div>
    <div class="pagination"></div>
    <div id="selected-filters"></div>
    <div id="tags-container"></div>
    <input type="text" id="search-bar" />
    <ul id="ingredient-options"></ul>
    <ul id="appliance-options"></ul>
    <ul id="utensil-options"></ul>
`;

beforeEach(() => {
    document.body.innerHTML = dom;
});

// Mock page global
global.setCurrentPage = jest.fn((page) => {
    const data = require("../data.js");
    data.currentPage = page; // Modifie directement la valeur dans le mock
});


// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Simule une réponse vide
    })
);

// Mock functions
global.getOptionsForType = jest.fn((type) => {
    if (type === "ingredient") return ["tomate", "poulet"];
    if (type === "appliance") return ["four"];
    if (type === "utensil") return ["couteau"];
    return [];
});

// Nettoyage après chaque test
afterEach(() => {
    jest.clearAllMocks();
});
