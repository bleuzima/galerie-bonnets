# Galerie de bonnets

Galerie de 100 bonnets numérotés de 01 à 100, classés en 3 groupes :
**CH4T** (01–45), **FL3UR** (46–80) et **8ULL3** (81–100).
Les groupes (nom et nombre de cases) se modifient en haut de `src/app.js` (`GROUPS`).

Un clic sur une case ouvre une pop-up avec les photos du bonnet (flèches ou swipe).
Site 100 % statique, sans base de données ni dépendance : déployé sur Vercel.

## Ajouter / changer les photos

1. Mets les photos d'un bonnet dans le dossier qui porte son numéro :

   ```
   photos/
     01/  1.jpg  2.jpg  3.jpg
     02/  1.jpg  2.jpg
     ...
     100/ 1.jpg
   ```

   - Les photos s'affichent dans l'ordre des noms (`1.jpg`, `2.jpg`, … `10.jpg`).
   - Formats acceptés : jpg, jpeg, png, webp, avif, gif, svg.
   - Un dossier vide ou absent = case grisée sur le site.
   - Conseil : réduis les photos à ~1600 px de large (≈ 300 Ko) avant de les ajouter,
     pour que le site charge vite sur les téléphones au marché.

2. Indique le prix dans `prix.json` (un bonnet sans prix n'affiche simplement pas de prix) :

   ```json
   {
     "01": "35 CHF",
     "02": "40 CHF"
   }
   ```

3. Publie :

   ```bash
   git add .
   git commit -m "Ajout bonnets"
   git push
   ```

   Vercel redéploie automatiquement en ~1 minute.

> Les dossiers `photos/01` à `photos/06` contiennent des images d'exemple : remplace-les par tes vraies photos.

## Voir le site en local

Nécessite Node.js (aucune installation de paquet).

```bash
npm run dev
```

Puis ouvre http://localhost:5173.

## Comment ça marche

- `src/` : la page (`index.html`, `style.css`, `app.js`).
- `scripts/build.mjs` : copie le site dans `dist/` et génère `manifest.json` (liste des photos + prix) à partir de `photos/` et `prix.json`.
- `vercel.json` : Vercel lance `node scripts/build.mjs` et publie `dist/`.
