import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { fileURLToPath } from 'node:url';
import hbs from 'hbs';

// Importación de rutas usando los alias configurados en package.json
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';
import authorRouter from '#routes/author.js';

// Importando el registrador de HELPERS de Vite
import { registerViteHelper } from './lib/vite.js';

// Recreando variables de path para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Configuración del motor de vistas (HBS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 2. Registro del helper de Vite para manejar assets dinámicos
registerViteHelper(hbs);

// 3. Middlewares básicos
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 4. Configuración de archivos estáticos
// Si estamos en producción, servimos el build de Vite
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// Servimos archivos públicos del backend (imágenes, etc.)
app.use(express.static(path.join(__dirname, '..', 'public')));

// 5. Registro de rutas principales
app.use(['/', '/index'], indexRouter);
app.use('/users', usersRouter);
app.use('/author', authorRouter);

// 6. Manejo de error 404
app.use((req, res, next) => {
  next(createError(404));
});

// 7. Manejador de errores (ESLint corregido con _next)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // Solo proporcionamos el error detallado en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizamos la página de error
  res.status(err.status || 500);
  res.render('error');
});

export default app;