# Commandes rapides — ngx-parrecrivains

## Test local — lib locale (avant publication npm)

Résout `ngx-parrecrivains` via path alias → `dist/ngx-parrecrivains/` (build local)

<!-- 1. Builder la lib en mode watch -->
cd /home/maiveBOX/ngx-parrecrivains/src && clear && npx ng build ngx-parrecrivains --watch

<!-- 2. Servir l'app (dans un 2e terminal) -->
cd /home/maiveBOX/ngx-parrecrivains/src && clear && npx ng serve

<!-- Visiter : http://localhost:4200/ngx-parrecrivains/ -->
<!-- Pages de test : http://localhost:4200/ngx-parrecrivains/tests/ -->

<!-- NGROK — exposer le test local au public pour valider en communauté avant de publier -->
clear && npx ngrok http 4200

---

## Test version publiée — GitHub Pages

Résout `ngx-parrecrivains` via npm (tsconfig.demo.json, paths vide)
Nécessite que la version soit publiée sur npm ET que le repo soit sur main.

<!-- 1. Vérifier la version npm installée vs publiée -->
cd /home/maiveBOX/ngx-parrecrivains/src && npm show ngx-parrecrivains version

<!-- 2. Mettre à jour si besoin -->
npm install ngx-parrecrivains@latest

###### Build GitHub Pages -->
cd /home/maiveBOX/ngx-parrecrivains/src && clear && npx ng build --ts-config=tsconfig.demo.json && cp ../docs/index.html ../docs/404.html
<!-- git add ../docs && git commit -m "..." && git push -->

<!-- Visiter : https://MaiveCL.github.io/ngx-parrecrivains/ -->
<!-- menu tests : https://MaiveCL.github.io/ngx-parrecrivains/tests -->

---

## Publication npm

<!-- 1. Bumper la version dans deux fichiers (même valeur) :
     - projects/ngx-parrecrivains/package.json → "version"
     - projects/ngx-parrecrivains/src/lib/version.ts → new Version('x.x.x')
-->

<!-- 2. Builder et publier -->
cd /home/maiveBOX/ngx-parrecrivains/src && clear && npx ng build ngx-parrecrivains
cd /home/maiveBOX/ngx-parrecrivains/src/dist/ngx-parrecrivains && npm login && npm publish

<!-- Première publication seulement : ajouter --access public -->

---

## Divers

<!-- Vérifier version installée localement -->
cd /home/maiveBOX/ngx-parrecrivains/src && npm show ngx-parrecrivains version

<!-- Installer une version spécifique -->
npm install ngx-parrecrivains@0.4.2

<!-- Tuer les processus ng -->
pkill -f "ng build"; pkill -f "ng serve"
