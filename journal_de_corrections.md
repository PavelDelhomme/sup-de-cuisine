# === Documentation des problèmes et solutions ===

## 12. Gestion des suggestions dynamiques
- *Problème* : La fonction `displaySuggestions` n'excluait pas les tags actifs et ne permettait pas d'afficher tous les tags.
- _Solution_ :
  - Ajout d'une logique pour exclure les tags actifs.
  - Limitation des suggestions initiales à 10 tags maximum.
  - Ajout d'une option "Afficher plus de tags" pour naviguer vers tous les tags disponibles.
  - Ajout d'un bouton "Revenir" pour revenir à la vue limitée.

## 11. Recherche et filtres améliorés
- *Problème* : Les recherches globales n’étaient pas normalisées, et les dropdowns s’ouvraient après chaque mise à jour.
- _Solution_ : 
  - Normalisation des entrées utilisateur (minuscules, suppression des espaces).
  - Mise à jour des dropdowns sans les ouvrir.
  - Ajout d'un bouton pour effacer la recherche globale tout en conservant les filtres appliqués.
  - Résolution du problème nécessitant deux clics pour appliquer un filtre.

## 10. Gestion des données manquantes dans les cartes
- *Problème* : Certaines recettes manquent de données comme des images ou des descriptions.
- _Solution_ : Ajout d'une vérification conditionnelle pour remplacer les données manquantes par des valeurs par défaut (exemple : image générique, message "Description non disponible").

## 9. Modification des readme et documentation de projet
- *Problème* : Les documents `.md` pour expliquer le projet et assurer un suivi n'étaient pas correctement implémentés.
- _Solution_ : Ajout des fichiers `taches_projets.md` et `journal_de_corrections.md`.

## 8. Composant aligné pour les cartes de recettes
- *Problème* : Les cartes de recettes n'avaient pas une présentation claire et alignée selon le mockup.
- _Solution_ : Création d'un nouveau composant pour organiser les cartes avec des informations alignées à gauche.

## 7. Champ texte dans les filtres ne se vide pas
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

---

# === Historique des commits ===

## 12. Commits - Nov 25, 2024
- `Mise à jour des fichiers de suivi du projet` - Ajout et modification des fichiers `journal_de_corrections.md`, `taches_projet.md` et création de `suivi-tests.md`.

## 11. Commits - Nov 25, 2024
- `Amélioration de la fonction displaySuggestions et gestion dynamique des tags` - Nov 25, 2024.

## 10. Commits - Nov 21, 2024
- `Gestion des données manquantes pour les cartes de recettes`.
- `Amélioration de la présentation des cartes et tests CSS`.

## 9. Commits - Nov 20, 2024
- `Correction des champs texte dans les filtres` - Ajout de la logique pour vider automatiquement le champ texte des filtres après la sélection.

## 8. Commits - Nov 19, 2024
- `Réorganisation du code CSS notamment` - Réorganisation du code CSS pour une meilleure lisibilité et maintenabilité.

## 7. Commits - Nov 18, 2024
- `Intégration de Docker et ajout d'explications dans le README`.
- `Réarrangement du filtre et ajout de la possibilité de supprimer des filtres avec des badges`.

## 6. Commits - Nov 17, 2024
- `Ajout de la recherche d'ingrédients`.
- `Organisation du code et gestion des recettes`.

## 5. Commits - Nov 16, 2024
- `Amélioration de l'affichage dynamique des filtres`.

## 4. Commits - Nov 15, 2024
- `Ajout de la pagination et ajustement des styles`.

## 3. Commits - Oct 28, 2024
- `Fonctionnalité de recherche initiale implémentée avec affichage des ingrédients dans des modals`.

## 2. Commits - Oct 25, 2024
- `Ajout des premières logiques JS pour les filtres`.

## 1. First commit
- `Mise en place initiale du projet`.
