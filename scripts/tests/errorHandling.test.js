import { displayNoResultsMessage } from "../recipes.js";

describe("Gestion des erreurs", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <main></main>
            <div class="pagination"></div>
        `;
    });

    test("devrait afficher un message si aucune recette trouvée", () => {
        displayNoResultsMessage("test");
        const message = document.querySelector("main p");
        expect(message.innerHTML).toContain("test");
    });
});
