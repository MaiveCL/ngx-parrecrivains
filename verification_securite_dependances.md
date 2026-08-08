# Vérification de sécurité des dépendances npm

Procédure à rejouer **chaque fois que npm signale des scripts d'installation non approuvés** :

```
npm warn allow-scripts 3 packages have install scripts not yet covered by allowScripts
```

Ça arrive après chaque `npm install`, `npm update` ou montée de version majeure (Angular, etc.) : les approbations sont **épinglées à la version exacte** dans `src/package.json` → `allowScripts`, donc une nouvelle version d'un paquet déjà approuvé repasse en attente. C'est voulu — c'est exactement la fenêtre où une attaque de chaîne d'approvisionnement passerait.

> **Règle non-négociable** : jamais `npm approve-scripts --all`. Un paquet à la fois, après vérification.

Un script d'installation s'exécute avec **tous les droits de l'utilisateur** au moment du `npm install` : accès à `~/.ssh`, `~/.npmrc`, variables d'environnement. C'est le vecteur privilégié des paquets compromis.

---

## Contexte

```bash
cd /home/maive/ngx-parrecrivains/src
npm approve-scripts --allow-scripts-pending   # liste ce qui est en attente
```

Les versions déjà approuvées se lisent dans `package.json` :

```json
"allowScripts": {
  "@parcel/watcher@2.5.6": true,
  "esbuild@0.27.3": true,
  "lmdb@3.5.1": true,
  "msgpackr-extract@3.0.4": true
}
```

Chaque paquet en attente passe les 6 étapes ci-dessous. Une seule étape qui cloche = ne pas approuver, investiguer.

---

## Étape 1 — Cohérence de version

Qui exige ce paquet, et est-ce bien la version que le parent épingle ? Une version qui ne correspond à la demande d'aucun parent est un drapeau rouge immédiat.

```bash
python3 - <<'EOF'
import json
lock = json.load(open('package-lock.json'))
cibles = {'esbuild', 'lmdb', 'msgpackr-extract'}   # ← les paquets en attente
for chemin, e in lock['packages'].items():
    deps = {**e.get('dependencies', {}), **e.get('optionalDependencies', {}), **e.get('devDependencies', {})}
    for c in cibles:
        if c in deps:
            nom = chemin.split('node_modules/')[-1] or '(racine)'
            print(f"{c:18} <- {nom} ({e.get('version','?')}) exige {deps[c]}")
EOF
```

Attendu : un parent légitime du projet (`@angular/build`, `ng-packagr`, `msgpackr`…) qui épingle exactement cette version.

## Étape 2 — Date de publication

Une version publiée il y a quelques heures ou quelques jours est le profil type d'un paquet compromis : les incidents sont généralement détectés et dépubliés en 24-72 h. Attendre est en soi une protection.

```bash
npm view <paquet> time --json | python3 -c "
import json,sys; t=json.load(sys.stdin)
for v in ['<version-approuvée>', '<version-en-attente>']: print(v, t.get(v))"
```

Seuil de confort : **au moins 2-3 semaines** depuis la publication, sauf correctif de sécurité urgent.

## Étape 3 — Mainteneurs et méthode de publication

```bash
npm view <paquet>@<version> maintainers _npmUser
```

Comparer avec la version déjà approuvée. Un mainteneur **ajouté ou remplacé** entre deux versions est le scénario classique du compte compromis ou du transfert de projet à un inconnu. Une publication par `GitHub Actions <npm-oidc-no-reply@github.com>` (trusted publishing) vaut mieux qu'une publication depuis un poste personnel.

## Étape 4 — Analyse du script lui-même

**L'étape qui compte le plus** — les autres vérifient l'emballage, celle-ci vérifie le contenu. Deux questions guident la lecture :

1. **Qu'est-ce qui a changé** depuis la version déjà approuvée ?
2. **Qu'est-ce que ça fait là ?** — chaque chose que fait le script doit se justifier par la raison d'être du paquet. Un extracteur msgpack n'a aucune raison de lire `~/.npmrc`. Un compilateur de binaire natif n'a aucune raison de contacter un domaine qui n'est pas le registre npm. Un paquet de build n'a rien à faire dans le dossier du projet en dehors du sien.

### 4a — Récupérer les deux versions et les comparer

```bash
SP=~/scratch-audit && mkdir -p $SP && cd $SP
npm pack <paquet>@<version-approuvée> <paquet>@<version-en-attente> --silent
for f in *.tgz; do d="${f%.tgz}"; mkdir -p "$d" && tar xzf "$f" -C "$d"; done

# Diff du script exécuté à l'installation
diff -u <paquet>-<ancienne>/package/install.js <paquet>-<nouvelle>/package/install.js

# Diff des scripts de cycle de vie, des deps et de la liste de fichiers
for v in <ancienne> <nouvelle>; do python3 -c "
import json; d=json.load(open('<paquet>-$v/package/package.json'))
print('$v', json.dumps({k:v for k,v in d.get('scripts',{}).items()
      if k in ('preinstall','install','postinstall','prepare')}))
print('   deps:', json.dumps(d.get('dependencies',{})))
print('   optionalDeps:', json.dumps(d.get('optionalDependencies',{})))"; done

diff <(cd <paquet>-<ancienne>/package && find . -type f | sort) \
     <(cd <paquet>-<nouvelle>/package && find . -type f | sort)
```

### 4b — Suivre le script jusqu'au code réellement exécuté

Le nom du script ne dit pas ce qui tourne. `"install": "node-gyp-build-optional-packages"` exécute le binaire d'un **autre paquet** — c'est lui qu'il faut lire, et vérifier que sa version n'a pas changé entre les deux versions du paquet parent.

```bash
grep -rn "https\?://\|require('https')\|net\.\|exec\|spawn\|process\.env\[" \
  node_modules/<résolveur>/*.js | head -20
```

### 4c — Chercher les comportements anormaux

```bash
grep -rnE "eval\(|new Function|Buffer\.from\([^,]+,\s*['\"]base64|atob\(|child_process|curl |wget |\.ssh|\.npmrc|\.env|NPM_TOKEN|AWS_|GITHUB_TOKEN|process\.env" \
  <paquet>-<nouvelle>/package/*.js
```

| Signal | Pourquoi c'est suspect |
|---|---|
| Domaine réseau autre que `registry.npmjs.org` (ou l'URL de release officielle du projet) | Exfiltration ou téléchargement de charge utile |
| `eval()`, `new Function()`, chaînes base64/hex longues, code minifié dans un script d'install | Obfuscation — aucune raison légitime dans un script d'installation |
| Lecture de `~/.npmrc`, `~/.ssh`, `.env`, `NPM_TOKEN`, `AWS_*`, `GITHUB_TOKEN` | Vol de secrets — le motif dominant des paquets npm compromis |
| Écriture hors du dossier du paquet | Persistance, modification d'autres dépendances |
| `child_process` vers `curl`/`wget`/`bash -c` | Exécution de code non versionné |
| Nouveau script `preinstall`/`postinstall` qui n'existait pas avant | Changement de comportement à justifier |
| Télémétrie, « analytics », ping de première installation | Pas notre rôle de l'accepter en silence |

## Étape 5 — Intégrité et provenance

L'intégrité du lock doit correspondre à celle du registre, et le tarball doit venir de `registry.npmjs.org`.

```bash
npm view <paquet>@<version> dist.integrity dist.tarball dist.attestations
python3 -c "
import json; lock=json.load(open('package-lock.json'))
e=lock['packages']['node_modules/<paquet>']
print(e.get('version'), e.get('integrity'), e.get('resolved'))"
```

Une attestation `https://slsa.dev/provenance/v1` prouve que le paquet a été construit par un pipeline CI public à partir d'un commit identifiable — le meilleur signal disponible.

## Étape 6 — Signatures de tout l'arbre

```bash
npm audit signatures
```

Vérifie la signature de registre de **tous** les paquets installés, pas seulement ceux en attente. Attendu : `N packages have verified registry signatures`, aucun échec.

---

## Décision

Tout est vert → approuver **un paquet à la fois** (l'entrée créée dans `package.json` est épinglée à la version exacte) :

```bash
npm approve-scripts esbuild
npm approve-scripts lmdb
npm approve-scripts msgpackr-extract
```

Un doute → `npm deny-scripts <paquet>` et vérifier si le projet build quand même : beaucoup de scripts d'install ne servent qu'à optimiser (binaire natif vs repli JavaScript).

`npm approve-scripts` **retire automatiquement l'entrée devenue obsolète** en ajoutant la nouvelle (`removed-stale esbuild@0.27.3` / `added esbuild@0.28.1`). C'est souhaitable : une entrée périmée qui traînerait signifierait qu'un retour à cette ancienne version — le scénario d'une attaque par rétrogradation — réexécuterait ses scripts sans jamais redemander d'approbation.

Le diff de `package.json` (section `allowScripts`) doit apparaître dans le commit, jamais être noyé dans un commit de mise à jour de dépendances.

---

## Note sur `npm audit fix --force`

**Ne jamais le lancer sans lire ce qu'il propose.** `--force` accepte les changements majeurs *à la baisse* : sur un projet où ce n'est pas voulu il peut rétrograder une dépendance majeure pour corriger une vulnérabilité modérée dans une devDependency, annulant une montée de version délibérée.

`npm audit fix` sans `--force` d'abord ; ensuite évaluer chaque vulnérabilité restante selon l'exposition **réelle** (dev vs production, plateforme concernée, chemin de code atteignable) plutôt que selon le score.

---

## Note — un script peut avoir déjà tourné avant l'approbation

Le message « install scripts blocked because they are not covered by `allowScripts` » décrit l'état de la **configuration**, pas l'historique du dossier `node_modules`. Si l'installation a d'abord été faite avec une version de npm antérieure à `allowScripts` (ou sans le garde-fou), les scripts ont pu s'exécuter et laisser leurs effets sur le disque, puis repasser « en attente » au moment où on interroge npm.

Comment le détecter — comparer l'arborescence installée au tarball du registre :

```bash
npm pack <paquet>@<version> --silent && tar xzf <paquet>-<version>.tgz
diff -r package node_modules/<paquet> --brief
```

Un fichier qui diffère est soit une trace d'exécution du script d'install (`esbuild` remplace son stub JS `bin/esbuild` par le binaire natif, en lien physique — même inode que `@esbuild/<plateforme>/bin/esbuild`), soit quelque chose à investiguer. Vérifier le hachage contre le paquet plateforme officiel :

```bash
sha256sum node_modules/esbuild/bin/esbuild node_modules/@esbuild/*/bin/esbuild
stat -c '%i %n' node_modules/esbuild/bin/esbuild node_modules/@esbuild/*/bin/esbuild   # inodes
```

Si le contenu correspond au paquet plateforme dont l'intégrité est déjà vérifiée par npm, l'effet est légitime. Pour retrouver un état reproductible et réellement gouverné par `allowScripts` : `rm -rf node_modules && npm install` **après** les approbations.

---

## Journal des vérifications

| Date | Déclencheur | Paquets vérifiés | Résultat |
|---|---|---|---|
| 2026-08-08 | Première installation du repo `ngx-parrecrivains` après migration depuis le monorepo — aucun `allowScripts` n'existait encore, les 4 paquets étaient en attente | `@parcel/watcher@2.5.6`, `esbuild@0.27.3`, `lmdb@3.5.1`, `msgpackr-extract@3.0.4` | ✅ Approuvés. Parents légitimes (`@angular/build@21.2.14` épingle esbuild 0.27.3 et lmdb 3.5.1 ; `msgpackr@1.11.12` exige `^3.0.2` ; `sass@1.97.3` exige `@parcel/watcher ^2.4.1`). Versions publiées 2 à 6 mois plus tôt (jan-mai 2026), aucune fraîche. Mainteneurs attendus (`devongovett`, `kriszyp`, esbuild publié par GitHub Actions OIDC avec provenance SLSA). Scripts : `@parcel/watcher` = no-op sauf `npm_config_build_from_source=true` ; `esbuild/install.js` = lien du binaire plateforme + validation `--version`, repli réseau **uniquement** vers `registry.npmjs.org` ; `lmdb` et `msgpackr-extract` = `node-gyp-build-optional-packages@5.2.2`, aucun accès réseau, repli `node-gyp rebuild` local. Aucun `eval`, base64, lecture de `~/.npmrc`/`~/.ssh`, ni télémétrie. Intégrités lock = registre pour les 4 ; 498/498 signatures vérifiées. **Réserve notée** : `node_modules/esbuild/bin/esbuild` était déjà le binaire natif lié en dur au paquet plateforme (même inode que `@esbuild/linux-x64`) — donc le `postinstall` d'esbuild s'était déjà exécuté avant l'approbation, lors d'une installation antérieure. Binaire byte-identique au paquet officiel (sha256 identique, intégrité vérifiée par npm), donc sans conséquence ici, mais l'installation n'était pas dans l'état « scripts bloqués » que le message de npm laissait supposer. Voir la note ci-dessous. |

---

> *allowScripts*. (s.d.). npm Docs. [Voir ↗](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
>
> *npm audit signatures*. (s.d.). npm Docs. [Voir ↗](https://docs.npmjs.com/cli/v11/commands/npm-audit)
>
> *SLSA provenance*. (s.d.). npm / GitHub. [Voir ↗](https://docs.npmjs.com/generating-provenance-statements)
