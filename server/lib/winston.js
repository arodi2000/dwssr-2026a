// Importamos las bibliotecas necesarias
import winston, { format } from "winston";
import "winston-daily-rotate-file"; // Importar el transporte para que se registre en winston
import path from "node:path";
import fs from "node:fs";

// Desestructurando funciones de formato desde winston
const {
    combine,
    timestamp,
    label,
    printf,
    colorize,
    prettyPrint } = format;

// Creando la ruta del directorio raíz
const __rootdir = path.resolve(process.cwd());

// Creando la ruta del directorio de logs en la raíz del proyecto
const logsDir = path.join(__rootdir, "logs");

// Rutina que crea la carpeta donde irán los logs solo en caso de no existir
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Definiendo esquema de colores
const colors = {
    error: "red",
    warn: "yellow",
    info: "magenta",
    debug: "blue"
};

// Aplicando esquema de colores a winston
winston.addColors(colors);

// Creamos los formatos de salida para los diferentes transportes
const myConsoleFormat = combine(
    // Agregar colores a este formato
    colorize({ all: true }), // Corregido: 'fall' a 'all'
    // Agregando la etiqueta
    label({ label: "📢" }),
    // Agrego formato de fecha
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    printf(
        (info) =>
            `[${info.level}] : ${info.label} : ${info.timestamp} : ${info.message}`
    )
);

// Formato para los archivos
const myFileFormat = combine(
    // Quitamos colorización
    format.uncolorize(),
    // Agregamos fecha en formato ISO
    timestamp(),
    // Salida en formato JSON
    format.json()
);

// Creando las opciones / transportes
// Creando el objeto de opciones para cada transporte
const options = {
  errorFile: {
    level: "error",
    filename: path.join(__rootdir, "logs", "error.log"),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: myConsoleFormat,
  },
  readableFile: {
    filename: path.join(logsDir, "app-readable.log"),
    level: "info",
    format: combine(
      format.uncolorize(),
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      prettyPrint(),
    ),
    maxsize: 5242880,
    maxFiles: 5,
  },
  dailyRotateFile: {
    filename: path.join(logsDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
    format: myFileFormat,
  },
};