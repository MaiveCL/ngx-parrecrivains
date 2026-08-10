# Commandes rapides — ngx-parrecrivains

================================================

## Builder la lib locale (préalable à tout test local)
```bash
cd ~/ngx-parrecrivains/src && clear && npx ng build ngx-parrecrivains --watch
```
```bash
ls ~/ngx-parrecrivains/src/dist/ngx-parrecrivains/
```

================================================

## Test local privé
```bash
cd ~/ngx-parrecrivains/src && clear && npx ng serve
```
http://localhost:4200/ngx-parrecrivains/
http://localhost:4200/ngx-parrecrivains/tests/

## Test public local
```bash
cd ~/ngx-parrecrivains/src && clear && npx ng serve --configuration=test-public
```
http://localhost:4200/ngx-parrecrivains/
http://localhost:4200/ngx-parrecrivains/tests/

## Test public temporaire — GitHub Pages (lib locale)
```bash
cd ~/ngx-parrecrivains/src && clear && npx ng build ngx-parrecrivains
cd ~/ngx-parrecrivains/src && npx ng build --configuration=test-public && cp ../docs/index.html ../docs/404.html
git add ../docs && git commit -m "..." && git push
```
https://MaiveCL.github.io/ngx-parrecrivains/

## Retour au site officiel
```bash
cd ~/ngx-parrecrivains/src && npx ng build && cp ../docs/index.html ../docs/404.html
git add ../docs && git commit -m "..." && git push
```
https://MaiveCL.github.io/ngx-parrecrivains/
https://MaiveCL.github.io/ngx-parrecrivains/tests

## Publication npm
```bash
cd ~/ngx-parrecrivains/src && clear && npx ng build ngx-parrecrivains
cd ~/ngx-parrecrivains/src/dist/ngx-parrecrivains && npm login && npm publish
```
### Première publication seulement : 
```bash
cd ~/ngx-parrecrivains/src/dist/ngx-parrecrivains && npm login && npm publish --access public
```

## Versions
```bash
cd ~/ngx-parrecrivains/src && npm show ngx-parrecrivains version && npm ls ngx-parrecrivains
cd ~/ngx-parrecrivains/src && npm install ngx-parrecrivains@latest
cd ~/ngx-parrecrivains/src && npm install ngx-parrecrivains@0.4.2
```

## Divers
```bash
cd ~/ngx-parrecrivains/src && npm ci
pkill -f "ng build"; pkill -f "ng serve"
```

---

## Notes de référence

- Bump de version = **deux** fichiers, même valeur : `projects/ngx-parrecrivains/package.json` et `projects/ngx-parrecrivains/src/lib/version.ts`.
- Repli silencieux : sans `dist/ngx-parrecrivains/`, c'est la version npm qui est servie, sans aucun avertissement.
- `ng build` écrit toujours dans `docs/`. Build de contrôle : `--output-path=/tmp/verif`.
- Sur GitHub Pages, une route profonde répond HTTP 404 tout en s'affichant correctement — normal.
- `ng` n'est pas installé globalement : toujours `npx ng`.