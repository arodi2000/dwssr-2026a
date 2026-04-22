import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function viteAssets() {
    const isDev = process.env.NODE_ENV !== 'production'; // Cambié 'produccion' por 'production' (estándar)
    const viteDevServer = process.env.VITE_DEV_SERVER || 'http://localhost:5173';

    if (isDev) {
        return `
          <script type="module" src="${viteDevServer}/@vite/client"></script>
          <script type="module" src="${viteDevServer}/main.js"></script>
        `;
    }

    const manifestPath = path.join(__dirname, '..', '..', 'dist', '.vite', 'manifest.json');

    if (!fs.existsSync(manifestPath)) {
        console.warn('Vite manifest not found. Run "npm run build" first');
        return '';
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const mainEntry = manifest['main.js']; // Corregido: mainEntry

    if (!mainEntry) {
        console.warn('main.js entry not found in Vite manifest');
        return '';
    }

    let tags = '';

    if (mainEntry.css) {
        mainEntry.css.forEach(cssFile => {
            tags += `<link rel="stylesheet" href="/${cssFile}">`; // link para CSS, no script
        });
    }

    tags += `<script type="module" src="/${mainEntry.file}"></script>`; // Corregido: backticks y cierre
    return tags;
}

export function registerViteHelper(hbs) {
    hbs.registerHelper(
        'viteAssets',
        () => new hbs.SafeString(viteAssets())
    );
}