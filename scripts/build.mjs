import { mkdir, readFile, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, 'dist');
if (output !== path.join(root, 'dist') || !output.startsWith(root + path.sep)) throw new Error('Dossier de sortie refusé.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'styles.css', 'main.js', 'globe.js', 'site-config.js', 'assets']) await cp(path.join(root, name), path.join(output, name), { recursive: true });
const html = await readFile(path.join(output, 'index.html'), 'utf8');
if (!html.includes('<title>SKAI') || html.includes('GEMINI_API_KEY')) throw new Error('Contenu de sortie invalide.');
console.log('Site statique prêt dans dist/ : aucun installateur, aucune configuration Gemini et aucune donnée utilisateur.');
