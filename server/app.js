import createError from 'http-errors';
import express from 'express';
import path from 'node:path'; // Deja esta
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'node:url'; // Usa también el prefijo node: aquí por consistencia
import hbs from 'hbs';
// LA LÍNEA 7 DEBE DESAPARECER

// Recreando variables de path para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();
// registro de las rutas a los enrutadores
// require se utiliza para importar módulos en CommonJS, pero en ES Modules se utiliza import, 
// por lo que se cambió la sintaxis de importación de las rutas. 
// Además, se agregó la extensión .js a los archivos de rutas para que funcione correctamente con ES Modules.
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var authorRouter = require('./routes/author'); // Importamos el enrutador de author

// se cambio require por import y se agrego la extensión .js a los archivos de rutas para que funcione con ES Modules
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';
import authorRouter from '#routes/author.js';
//importando el registrador del HELPERS
import { registerViteHelper } from './lib/vite.js';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//registrandro helpers para el ENGINE
registerViteHelper(hbs)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//.archivos estatticos de vite 
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '..', 'dist')))
}
//arhivos estatios backend
app.use(express.static(path.join(__dirname, '../public')));
console.log('Ruta de archivos estáticos:', path.join(__dirname, '../public'));

//regustrando
app.use(['/', '/index'], indexRouter);
app.use('/users', usersRouter);
app.use('/author', authorRouter);


app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app
export default app; // Exportamos la aplicación usando ES Modules 