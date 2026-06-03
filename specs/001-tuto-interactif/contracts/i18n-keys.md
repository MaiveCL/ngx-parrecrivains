# Contrat des clés i18n — Scaffold Pédagogique Interactif

**Feature**: `001-tuto-interactif` | **Date**: 2026-06-03

---

## Structure des fichiers

```
src/src/assets/i18n/
├── fr.json    ← langue par défaut
└── en.json    ← langue secondaire (même structure)
```

## Structure JSON complète

```json
{
  "nav": {
    "accueil": "Accueil",
    "langue": "English",
    "tutos": "Tutoriels",
    "tuto.isbn": "isbnValidator",
    "tuto.mots": "MotsPipe",
    "tuto.temps": "TempsLecture",
    "tuto.liseuse": "Liseuse"
  },

  "commun": {
    "slot.placeholder": "← Le composant apparaîtra ici après intégration",
    "slot.placeholder.before": "Intégrez le composant pour voir quelque chose ici",
    "integration.titre": "Comment intégrer",
    "integration.etape1": "1. Installer la lib",
    "integration.etape2": "2. Ajouter l'import",
    "integration.etape3": "3. Ajouter dans imports[ ]",
    "integration.etape4": "4. Ajouter la balise dans le template",
    "tests.titre": "Boutons de test",
    "tests.payload": "Code exécuté",
    "tests.resultat": "Résultat",
    "problemes.titre": "Problèmes fréquents",
    "problemes.symptome": "Symptôme",
    "problemes.cause": "Cause probable",
    "problemes.solution": "Solution",
    "copier": "Copier",
    "copie": "Copié !"
  },

  "accueil": {
    "titre": "Bienvenue dans le tutoriel ngx-parrecrivains",
    "description": "Ce site vous guide dans l'intégration de la librairie Angular ngx-parrecrivains.",
    "fait.titre": "Déjà fait dans cette branche",
    "fait.etape1": "Projet Angular créé (ng new)",
    "fait.etape2": "Structure de base en place",
    "fait.etape3": "Routing configuré",
    "afaire.titre": "À faire pour démarrer",
    "afaire.etape1": "Cloner la branche tuto-depart",
    "afaire.etape2": "Installer les dépendances Angular",
    "afaire.etape3": "Installer ngx-parrecrivains",
    "afaire.etape4": "Lancer le serveur de développement",
    "navigation.titre": "Choisissez un composant à intégrer"
  },

  "tuto.isbn": {
    "titre": "isbnValidator / validerIsbn",
    "version": "v0.4.0",
    "type": "Validateur de formulaire réactif",
    "description": "Valide mathématiquement un ISBN-10 ou ISBN-13.",
    "element.manquant": "Ajoutez isbnValidator() dans le tableau de validateurs du FormControl",
    "info.props": "Propriétés",
    "info.erreurs": "Clés d'erreur",
    "test.valide13": "ISBN-13 valide",
    "test.invalide": "Format invalide",
    "test.checksum": "Checksum incorrect",
    "probleme.1.symptome": "Aucune erreur malgré un ISBN incorrect",
    "probleme.1.cause": "isbnValidator() manquant dans le FormControl",
    "probleme.1.solution": "Ajouter isbnValidator() dans le tableau de validateurs",
    "probleme.2.symptome": "Erreur isbnFormat sur un ISBN avec tirets",
    "probleme.2.cause": "Les tirets ne sont pas acceptés (ex. 978-2-7646-3329-1)",
    "probleme.2.solution": "Entrer l'ISBN sans tirets : 9782764633291",
    "probleme.3.symptome": "Erreur TypeScript : Cannot find module 'ngx-parrecrivains'",
    "probleme.3.cause": "La librairie n'est pas installée",
    "probleme.3.solution": "Exécuter : npm install ngx-parrecrivains"
  },

  "tuto.mots": {
    "titre": "MotsPipe / WordsPipe",
    "version": "v0.2.0",
    "type": "Pipe Angular",
    "description": "Formate un nombre de mots avec accord singulier/pluriel selon la langue.",
    "element.manquant": "Ajoutez | mots après l'expression dans le template",
    "test.court": "1 mot",
    "test.moyen": "1 234 mots",
    "test.long": "45 231 mots",
    "test.zero": "0 mot",
    "probleme.1.symptome": "Le nombre s'affiche sans formatage (ex. « 1234 »)",
    "probleme.1.cause": "Le pipe | mots n'est pas dans le template",
    "probleme.1.solution": "Modifier {{ nombreMots() }} → {{ nombreMots() | mots }}",
    "probleme.2.symptome": "MotsPipe est inconnu dans le template",
    "probleme.2.cause": "MotsPipe manquant dans imports: [] du composant",
    "probleme.2.solution": "Ajouter MotsPipe dans le tableau imports du @Component",
    "probleme.3.symptome": "Espace bizarre entre le nombre et 'mots'",
    "probleme.3.cause": "C'est une espace fine insécable (typographie française normale)",
    "probleme.3.solution": "Comportement correct — aucune action requise"
  },

  "tuto.temps": {
    "titre": "TempsLectureService",
    "version": "v0.3.0",
    "type": "Service Angular",
    "description": "Estime et formate le temps de lecture à partir d'un nombre de mots.",
    "element.manquant": "Injectez TempsLectureService et calculez le temps dans un computed()",
    "test.court": "Article court (600 mots)",
    "test.roman": "Roman complet (80 000 mots)",
    "test.essai": "Essai (15 000 mots)",
    "probleme.1.symptome": "Le temps reste à '??'",
    "probleme.1.cause": "TempsLectureService pas encore injecté",
    "probleme.1.solution": "Ajouter inject(TempsLectureService) + computed() dans le composant",
    "probleme.2.symptome": "estimer() retourne un grand nombre",
    "probleme.2.cause": "estimer() retourne des secondes, pas des minutes",
    "probleme.2.solution": "Utiliser formater(estimer(n)) pour obtenir '5 min'",
    "probleme.3.symptome": "Erreur TypeScript : Cannot find module",
    "probleme.3.cause": "La librairie n'est pas installée",
    "probleme.3.solution": "Exécuter : npm install ngx-parrecrivains"
  },

  "tuto.liseuse": {
    "titre": "LiseuseManuscritComponent",
    "version": "v0.1.0",
    "type": "Composant Angular",
    "description": "Affiche un manuscrit avec contrôles de lecture intégrés.",
    "element.manquant": "Ajoutez la balise <ngx-liseuse-manuscrit [contenu]=\"contenu()\" /> dans le slot",
    "test.texte": "Texte brut",
    "test.html": "Contenu HTML",
    "test.gdocs": "URL Google Docs",
    "probleme.1.symptome": "La liseuse n'apparaît pas",
    "probleme.1.cause": "Balise <ngx-liseuse-manuscrit> manquante dans le template",
    "probleme.1.solution": "Ajouter la balise dans la zone slot du template HTML",
    "probleme.2.symptome": "La liseuse s'affiche à hauteur 0",
    "probleme.2.cause": "Le conteneur parent n'a pas de hauteur CSS définie",
    "probleme.2.solution": "Ajouter height: 400px (ou similaire) sur le conteneur parent",
    "probleme.3.symptome": "Google Docs : 'Document privé'",
    "probleme.3.cause": "Le document Google Docs n'est pas partagé publiquement",
    "probleme.3.solution": "Dans Google Docs : Partager → Tout le monde peut consulter"
  }
}
```

---

## Règles de clés

- Toutes les clés sont en minuscules, avec points comme séparateurs
- Les valeurs sont en français dans `fr.json`, en anglais dans `en.json`
- Les clés de commandes shell (`commande:`) ne sont pas traduites — identiques dans les deux fichiers
- Les clés de code TypeScript dans les snippets (`codeDisplay`) ne passent pas par i18n
- Le `LangueService` charge le fichier entier en mémoire — limiter à ~100 clés max par fichier
