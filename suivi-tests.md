# === Suivi des tests ===

## Objectifs des tests
 - Vérifier le bon fonctionnement des fonctionnalités critiques du site.
 - Identifier les problèmes potentiels avant le déploiement.
 - Garantir une expérience utilisateur fluide et accessible.

---

## Tests réalisés

### Recherche et filtres
- [x] Vérification du comportement des filtres (ingrédients, ustensiles, appareils).
- [x] Test de la recherche globale avec des mots-clés spécifiques.
- [ ] Vérification de la mise à jour correcte des recettes après l'application des filtres.

### Pagination
- [ ] Vérification de la navigation entre les pages.
- [ ] Test des transitions et animations entre les pages.

---

## Tests à planifier

### Accessibilité (a11y)
- [ ] Navigation au clavier sur tous les éléments interactifs.
- [ ] Ajout des balises `aria-label` pour les boutons et liens.

### Résilience des données
- [ ] Gestion des données manquantes dans les recettes (image par défaut, description).
- [ ] Vérification des comportements en cas de données corrompues ou invalides.

### Gestion des suggestions
- [ ] Exclusion des tags actifs dans les suggestions affichées.
- [ ] Fonctionnement de l'option "Afficher plus de tags".