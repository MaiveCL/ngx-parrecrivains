# ngx-parrecrivains — Site de démonstration / Demo site

[Français](#français) · [English](#english)

---

## Français

**Site de démonstration et documentation interactive** de la librairie Angular [`ngx-parrecrivains`](https://www.npmjs.com/package/ngx-parrecrivains).

🌐 **Site en ligne** : [https://maivecl.github.io/ngx-parrecrivains/](https://maivecl.github.io/ngx-parrecrivains/)

### À propos

Ce repository contient le site de démo de la librairie — pas la librairie elle-même. Il propose :

- Une démonstration interactive de chaque composant, pipe, service et validator
- Des snippets de code copy-paste prêts à l'emploi
- Une documentation intégrée bilingue (fr/en)
- Un tutoriel guidé pour intégrer la librairie dans un projet Angular existant

### Deux branches pédagogiques

| Branche | Contenu |
|---|---|
| `main` | Démo complète — librairie installée, tous les composants fonctionnels |
| `tuto-depart` | Scaffold pédagogique — librairie non installée, éléments à compléter |

La branche `tuto-depart` sert de point de départ pour un exercice guidé : l'utilisateur installe la librairie et complète les intégrations manquantes en suivant les instructions du site.

### Contenu de la librairie couvert

| Élément | Type | Version |
|---|---|---|
| `ngx-liseuse-manuscrit` | Composant | v0.1.x |
| `mots` · `words` | Pipe | v0.2.x |
| `TempsLectureService` | Service | v0.3.x |
| `isbnValidator` · `validerIsbn` | Validator | v0.4.x |

### Lancer le site en local

```bash
git clone https://github.com/MaiveCL/ngx-parrecrivains.git
cd ngx-parrecrivains/src
npm install
npx ng serve
```

→ Ouvrir [http://localhost:4200](http://localhost:4200)

---

## English

**Interactive demo site and documentation** for the Angular library [`ngx-parrecrivains`](https://www.npmjs.com/package/ngx-parrecrivains).

🌐 **Live site**: [https://maivecl.github.io/ngx-parrecrivains/](https://maivecl.github.io/ngx-parrecrivains/)

### About

This repository contains the demo site for the library — not the library itself. It provides:

- An interactive demonstration of each component, pipe, service and validator
- Copy-paste ready code snippets
- Integrated bilingual documentation (fr/en)
- A guided tutorial for integrating the library into an existing Angular project

### Two pedagogical branches

| Branch | Content |
|---|---|
| `main` | Complete demo — library installed, all components functional |
| `tuto-depart` | Pedagogical scaffold — library not installed, elements to complete |

The `tuto-depart` branch serves as a starting point for a guided exercise: the user installs the library and completes the missing integrations by following the site's instructions.

### Library contents covered

| Element | Type | Version |
|---|---|---|
| `ngx-liseuse-manuscrit` | Component | v0.1.x |
| `mots` · `words` | Pipe | v0.2.x |
| `TempsLectureService` | Service | v0.3.x |
| `isbnValidator` · `validerIsbn` | Validator | v0.4.x |

### Run locally

```bash
git clone https://github.com/MaiveCL/ngx-parrecrivains.git
cd ngx-parrecrivains/src
npm install
npx ng serve
```

→ Open [http://localhost:4200](http://localhost:4200)

---

MIT © 2026 [parrecrivains](https://parrecrivains.com)
