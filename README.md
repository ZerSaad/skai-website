# SKAI : page de présentation

Page statique indépendante de l’application desktop, prête à héberger sur Vercel. Aucun SDK Gemini, aucune clé API et aucune donnée utilisateur ne sont intégrés au site.

## Aperçu local

Dans un terminal VS Code, depuis ce dossier :

```powershell
npm run dev
```

Puis ouvrir **http://127.0.0.1:4174** dans le navigateur. Aucun `npm install` n’est nécessaire. `npm run check` contrôle la syntaxe des modules JavaScript. Arrêter le serveur avec Ctrl+C.

L’environnement isolé de l’agent a pu démarrer le serveur mais n’a pas pu rendre son adresse loopback accessible au navigateur de contrôle. La vérification visuelle complète doit donc être faite depuis ce terminal local ou après un déploiement de prévisualisation. Les contrôles de fichiers et de logique sont distincts de cette vérification visuelle.

## Contenu et interactions

- Globe sphérique léger dessiné en Canvas avec la cartographie Natural Earth, sélection Marrakech / Tokyo / Lisbonne et rotation au glisser sur ordinateur.
- Pause de rotation et respect de la préférence de réduction des animations.
- Exemples de conversation par onglets, clairement identifiés comme exemples sans appel IA.
- Véritable extrait audio de la voix Kore utilisée par SKAI, généré avec Gemini Live pour cette page. Lecture uniquement après un clic, pause et transcription accessible. Aucun micro activé par le site.
- Présentation de la mémoire locale et fenêtre d’information sur la confidentialité.
- Navigation mobile, FAQ native et accès clavier.
- Téléchargement actif vers l’installateur de la préversion v0.1.0 publiée sur GitHub.

La photo d’illustration est générée pour le site ; ce n’est ni une capture de l’application ni une photographie documentaire. Le visuel et son prompt sont documentés dans `ASSET-PROMPTS.md`. Police Outfit sous licence OFL et icônes Tabler sous licence MIT, auto-hébergées avec leurs notices. La page ne charge pas de police ou de script depuis un CDN.

## Configuration du téléchargement

La release v0.1.0 a été vérifiée et le téléchargement est activé dans **site-config.js** :

```js
published: true
```

La configuration pointe déjà vers `ZerSaad/skai-releases`, tag `v0.1.0`, fichier `SKAI-Setup-0.1.0-x64.exe`. Vérifier le nom réel avant l’activation. Le bouton utilisera alors le lien direct de cette release ; il ne dépend pas du raccourci `latest`, qui exclut normalement les préversions.

Tant que `published` reste à `false`, le visiteur voit « Bientôt sur Windows » et peut suivre les releases sur GitHub. Le site n’interroge pas automatiquement l’API GitHub et ne simule pas une disponibilité.

## Déployer sur Vercel

Ce dossier doit être un projet distinct du dossier desktop. Ne jamais choisir `skai`, `skai-installer` ou leur dossier parent comme racine du site : ils contiennent des éléments qui ne doivent pas être publiés avec la page.

Depuis Vercel, importer un dépôt contenant **uniquement ce dossier**, puis sélectionner :

- Framework Preset : **Other**
- Build Command : **npm run build**
- Output Directory : **dist**
- Aucune variable d’environnement nécessaire.

Le fichier `vercel.json` décrit l’hébergement statique et les en-têtes de sécurité. Le build copie uniquement la page et ses ressources dans `dist`, sans documentation ni scripts de développement. `.vercelignore` exclut la documentation et les éléments locaux lors d’un déploiement CLI. L’installateur doit rester sur GitHub Releases ; il ne fait pas partie du site.

Cette livraison prépare les fichiers localement. Aucun déploiement ni publication n’a été lancé.
