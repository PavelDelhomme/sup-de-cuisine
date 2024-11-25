# Tâches à faire

## Refactoriser le CSS pour les cartes
- [ ] Adapter les styles CSS pour que les cartes affichent les informations comme dans le mockup :
  - Image alignée à gauche.
  - Mise en page claire et responsive.
- [ ] Tester la compatibilité avec les médias responsives.

## Améliorer le système de pagination
- [ ] Ajouter une animation pour les transitions entre les pages.
- [ ] Afficher un résumé des pages (par exemple `Page 1 sur 10`).

## Renforcer l'accessibilité (a11y)
- [ ] Ajouter des balises `aria-label` pour tous les éléments interactifs (boutons, liens, filtres...).
- [ ] Tester la navigation clavier pour s'assurer que toutes les fonctionnalités sont utilisables sans souris.

## Ajouter des tests pour les fonctionnalités critiques
- [x] Test du comportement des filtres et de la recherche.
- [ ] Vérification que les recettes s'affichent correctement après un filtrage.

---

# Tâches réalisées

## Amélioration de la gestion des suggestions
- [x] Exclure les tags actifs des suggestions affichées.
- [x] Limiter l'affichage initial des tags à 10 suggestions.
- [X] Ajouter une option "Afficher plus de tags" et un bouton "Revenir".

## Composant pour générer les cartes de recettes
- [x] Implémenter un composant JavaScript modulaire pour générer les cartes de recettes avec un alignement sur la gauche.
- [x] Utiliser la mise en page du mockup fourni pour organiser les éléments (titre, description, ingrédients) à gauche.
- [x] Ajouter une gestion pour les données manquantes ou vides (absence d'image ou de description par ex).

## Mettre à jour la fonction `displayRecipes()`
- [x] Utiliser le nouveau composant de cartes pour remplacer le code HTML existant.
- [x] Optimiser la gestion de recettes affichées pour éviter les duplications.


## Mise en place initiale du projet
- [x] Configuration du fichier HTML, CSS et JS de base.
- [x] Création des dossiers nécessaires (scripts, styles, data).

## Recherche globale fonctionnelle
- [x] Ajout d’une recherche avec mise à jour des recettes affichées.
- [x] Réinitialisation correcte de la recherche.

## Gestion des filtres (Dropdowns)
- [x] Affichage dynamique des ingrédients, appareils et ustensiles.
- [x] Création de badges pour visualiser les filtres actifs.
- [x] Correction du problème de double clic pour appliquer un filtre.

## Système de pagination
- [x] Implémentation initiale des boutons de pagination pour parcourir les recettes.
