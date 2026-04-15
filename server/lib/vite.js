import fs  from 'node:fs'
import path from 'node:path'
import{fileURLToPath} from 'node:url'

const__filename= fileURLToPath(import.meta.url);
const__dirname = path.dirname(__filename)

/**
 * helper para handlebars que genera las etiquetas
 * de vite
 * En desarrollo: Conecta añ servidor de vite
 * En produccion:usa los archivos compilados
 * del manifest
 */
export function viteAssets(){
    const isDev = process.env.NODE_ENV !== 'produccion'
    const viteDevServer =process.env.VITE_DEV_SERVER ||'http://localhost:5173'

    if(isDev){
        //en desarrollo, cargamos el codigo para el front-end
        //diretamente del servidor Vite
        //@vite/client da acceso a un servidor HMR(HOT MODULE REPLACEMENT)
        //main.js Front-end entry point
        return `
         <script type="module" src="${viteDevServer}/@vite/client"></script>
         <script type="module" src="${viteDevServer}/main.js"></script>
         `;
    }
    //en modo produccion
    //leyendo el manifierto
    const manifestPath =  path.join(__dirname,'..','..','dist','.vite','manifest.json')

    //verificamos el manifiesto existe
    if(!fs.existsSync(manifestPath)){
        console.warn('Vite manifest not found. Run "npm run build" first')
        return '';
    }

    //parseando el manifest
    const manifest = JSON.parse(
        fs.readFileSync(manifestPath,'utf-8')
    );

    //obtener el punto de entrada de los scripts del frond-end
    const mianEntry = manifest['main.js']

    //verificando la correcta carga del mainEntry
    if(!mianEntry){
        console.warn('mian.js entry not found in Vite manifest');
        return '';
    }

    //crando la variable que contendra la etiqueta 
    //de los scripts del front-end
    let tags = '';

    //CSS files
    if(mainEntry.css){
        mainEntry.css.forEach(cssFile => {
            tags += `<script type="stylesheet" src="/${cssFile}"></script>`
        });
    }

    //JS File
    tags +='<script type="module" src="/${mainEntry.file}"</script>'
    return tags;

   
    }
     //registrar el HELPER
    export function registerViteHelper(hbs){
        hbs.registerHelper(
            'viteAssets',
             ()=>new hbs.SafeString(viteAssets())
             )
        }
    

