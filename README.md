# Pronos Star Ac' (saison 14)

Site de pronostics entre amis pour la Star Academy 2026. Site non officiel.

## Contenu du dossier

- `index.html` : le site complet
- `data.json` : les résultats et les pronos de tout le monde. C'est le seul fichier à modifier pendant la saison.

## Mettre le site en ligne avec GitHub Pages (une seule fois)

1. Sur github.com, clique sur **New repository**. Nomme-le par exemple `pronos-star-ac`, choisis **Public**, puis clique sur **Create repository**.
2. Sur la page du dépôt, clique sur **uploading an existing file**. Glisse `index.html`, `data.json` et `README.md`, puis clique sur **Commit changes**.
3. Va dans **Settings → Pages**. Sous *Branch*, choisis `main` et `/ (root)`, puis clique sur **Save**.
4. Une à deux minutes plus tard, le site est en ligne à l'adresse `https://TON-PSEUDO.github.io/pronos-star-ac/`. Envoie ce lien à tes amis.

## Pendant la saison

**Les joueurs**, dans l'onglet *Mon prono* :
- ils classent les 17 élèves et, une fois les nominés connus, choisissent qui part samedi ;
- ils écrivent leur prénom puis touchent **Envoyer** (ou **Copier**) et t'envoient le message.

Leur brouillon reste enregistré dans leur navigateur.

**Toi**, l'organisateur :
1. Ouvre le site et clique sur **Espace organisateur** tout en bas de la page (ou ajoute `#orga` à la fin de l'adresse).
2. Colle les messages reçus, puis saisis l'immunisé (samedi), les nominés (mercredi) et l'éliminé (samedi).
3. Clique sur **Mettre le site à jour**, puis copie le contenu proposé.
4. Sur GitHub, ouvre `data.json`, clique sur le crayon, remplace tout le contenu, puis clique sur **Commit changes**.

Tant que l'étape 4 n'est pas faite, tes changements ne sont visibles que dans ton navigateur.

## Changer une photo

Les portraits officiels sont dans le dossier `photos/` (un fichier par élève, par exemple `photos/amel.jpg`). Pour en changer un, remplace simplement le fichier en gardant le même nom.

Tu peux aussi pointer vers une autre image depuis `data.json` :

```json
"photos": { "felix": "photos/felix-2.jpg" }
```

Les identifiants des élèves sont leur prénom en minuscules et sans accent : `amel`, `antoine`, `brieuc`, `cameron`, `elija`, `felix`, `isabella`, `khalil`, `kylian`, `leeloo`, `maud`, `melina`, `morgan`, `noemie`, `tracy`, `ydriss`, `zoe`.

## Barème

| Situation | Points |
|---|---|
| Élève à sa place exacte dans le classement final | 5 |
| Élève à une place d'écart | 3 |
| Élève à deux places d'écart | 1 |
| Éliminé de la semaine trouvé | 3 |
| Vainqueur trouvé | +10 |

Les points du classement final ne comptent que si le classement est complet (17 élèves).
