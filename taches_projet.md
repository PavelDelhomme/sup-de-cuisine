# Tâches à faire
# - Créer un composant pour générer les cartes de recettes
 - Implémenter un composant JavaScript modulaire pour générer les cartes de recettes avec un alignement sur la gauche.
 - Utiliser la mise en page du mockup fourni pour organiser les éléments (titre, description, ingrédients) à gauche.
 - Ajouter une gestion pour les données manquantes ou vides (absence d'image ou de description par ex).

# - Mettre à jour la fonction `displayRecipes()`
 - Utiliser le nouveau composants de cartes pour remplacer le code HTML existant.
 - Optimiser la gestion de recettes affichées pour éviter les duplications.

# - Refactoriser le CSS pour les cartes
 - Adapter les styles CSS pour que les cartes affichent les informations comme dans le mockup :
 - Image alignée à gauche
 - Tester la compatibilité avec les médias responsives.

# - Améliorer le système de pagination
 - Ajouter une animation pour les transitions entres les pages.
 - Afficher un résumé des pages (par exemple `Page 1 sur 10`).

# - Renforcer l'accessibilité (a11y)
 - Ajouter des balises `aria-label` pour tous les éléments interactifs (boutons, liens, filtres, ...).
 - Tester la navigation clavier pour s'assurer que toutes les fonctionnalités sont utilisables sans souris.

# - Ajouter des tests pour les fonctionnalités critiques.
 - Test du comportement des filtres et de la recherche.
 - Vérification que les recettes s'affichent correctement après un filtrage.

# Tâches réalisées
# - Mise en place initiale du projet
 - Configuration du fichier HTML, CSS et JS de base.
 - Création des dossiers nécessaires (scripts, styles, data).
# - Recherche globale fonctionnelle
 - Ajout d’une recherche avec mise à jour des recettes affichées.
 - Réinitialisation correcte de la recherche.
# - Gestion des filtres (Dropdowns)
 - Affichage dynamique des ingrédients, appareils et ustensiles.
 - Création de badges pour visualiser les filtres actifs.
# - Système de pagination
 - Implémentation initiale des boutons de pagination pour parcourir les recettes.
