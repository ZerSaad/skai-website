# Visuels et extrait vocal

## Illustration

Mode : outil image_gen intégré, génération d’une image nouvelle.

Fichier final du site : `assets/japan-evening.webp`. L’image source est conservée dans le dossier des images générées Codex ; le site utilise une copie optimisée WebP. Aucun visuel existant n’a été écrasé.

Prompt exact :

> Use case: photorealistic-natural. Asset type: wide editorial travel photograph for the SKAI travel companion website, no text anywhere. Primary request: a cinematic, believable Japanese lakeside village at blue hour with Mount Fuji in the distance, a small traditional wooden lakeside cafe in the left foreground, subtle warm lanterns reflected on still water, delicate mist, a few cherry blossom branches at the very edge. Composition: very wide horizontal panoramic 2:1 photograph, scenic main subject concentrated toward right-middle, mountains and deep navy sky, foreground rich pine green, elegant and calm, realistic architecture and nature, natural film grain, premium travel magazine photography. Palette: deep forest green and midnight blue, restrained warm lights, no neon purple. No typography, no logos, no UI, no collage, no watermark. This is an atmospheric illustration of travel, not a screenshot of software.

## Voix

Fichier : `assets/skai-hello.wav`, audio PCM mono, voix Kore, modèle Gemini Live disponible pour le projet. Le texte effectivement transcrit se trouve dans `assets/voice-transcript.txt`.

Texte demandé :

> Salut, moi c’est SKAI. Une envie de Tokyo, de Lisbonne, ou complètement ailleurs ? Raconte-moi. On prépare ça ensemble.

L’extrait est préenregistré : sa lecture sur le site ne déclenche aucun appel à Gemini, ne consomme pas la clé du projet et ne demande aucun accès au microphone.

## Autres ressources

- Globe : points et frontières dérivés du fichier Natural Earth 1:110m utilisé dans l’application. Données de domaine public, frontières simplifiées.
- Icône SKAI : icône déjà créée pour l’installateur.
- Outfit : Google Fonts, licence OFL, copie dans `assets/FONT-LICENSE.txt`.
- Icônes : Tabler Icons, licence MIT, copie dans `assets/ICONS-LICENSE.txt`.
