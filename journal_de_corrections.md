# === Documentation des problèmes et solutions ===
## 9. Modification des readme et documentation de projet.
- *Problème* : Les documents .md pour expliquer le projets et assurer un suivi n'était pas correctement implementer.
- _Solution_ : Ajout de ces fichiers.
## 8. Composant aligné pour les cartes de recettes.
- *Problème* : Les cartes de recettes n'avaient pas une présentation claire et alignée selon le mockup.
- _Solution_ : Création d'un nouveau composant pour organiser les cartes avec des informations alignées à gauche et à droite.

## 7. Champ texte dans les filtres ne se vide pas.
- *Problème* : Après la sélection d'un filtre (ingrédients, ustensiles ou appareils), le champ texte associé restait rempli au lieu de se vider.
- _Solution_ : Ajout d'une ligne pour réinitialiser la valeur du champ texte après l'ajout d'un filtre. 

## 6. Affichage des recettes
- *Problème* : Les images des recettes étaient affichées à des tailles incorrectes.
- _Solution_ : Ajout de styles CSS pour ajuster les tailles et utiliser des grilles flexibles.

## 5. Pagination
- *Problème* : Les boutons de pagination ne fonctionnaient pas correctement.
- _Solution_ : Correction de la logique pour diviser `filteredRecipes` en pages, avec un calcul dynamique de `totalPages`.

## 4. Recherche globale
- *Problème* : La recherche globale affichait des erreurs lorsque les résultats étaient mis à jour.
- _Solution_ : Réinitialisation correcte des recettes filtrées (`filteredRecipes`) et de `currentPage`.

## 3. Dropdowns (Filtres)
- *Problème* : Les filtres d'ingrédients, d'ustensiles et d'appareils n'affichaient pas les options correctes ou généraient des erreurs lors de la sélection.
- _Solution_ : Correction de la logique pour mettre à jour les options dynamiquement et afficher des badges pour les filtres sélectionnés.

## 2. Événements de clic
- *Problème* : Les clics sur les boutons de pagination et les filtres généraient des erreurs en raison de constantes immuables.
- _Solution_ : Utilisation de fonctions pour mettre à jour les variables globales comme `currentPage`.

## 1. Font Google
- *Problème* : Une erreur "Failed to decode downloaded font" apparaissait dans la console.
- _Solution_ : L'erreur a été ignorée, car elle n'affecte pas la fonctionnalité principale.

___

# === Historique des commits ===

## 8. Commits - Nov 20, 2024
- `Correction des champs texte dans les filtres` - Ajout de la logique pour vider automatiquement le champs texte des filtres après la sélection.

## 7. Commits - Nov 19, 2024
- `Réorganisation du code CSS notamment` - Réorganisation du code CSS pour une meilleure lisibilité et maintenanbilité.

## 6. Commits - Nov 18, 2024
- `Intégration de Docker et ajout d'explications dans le README`.
- `Réarrangement du filtre et ajout de la possibilité de supprimer des filtres avec des badges`.

## 5. Commits - Nov 17, 2024
- `Ajout de la recherche d'ingrédients`.
- `Organisation du code et gestion des recettes`.

## 4. Commits - Nov 16, 2024
- `Amélioration de l'affichage dynamique des filtres`.

## 3. Commits - Nov 15, 2024
- `Ajout de la pagination et ajustement des styles`.

## 2. Commits - Oct 28, 2024
- `Fonctionnalité de recherche initiale implémentée avec affichage des ingrédients dans des modals`.

## 1. First commit
- `Mise en place initiale du projet`.

