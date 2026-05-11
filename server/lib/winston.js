import winston, { format } from "winston";
import path from "node:path";
import fs from "node:fs";
import DailyRotateFile from "winston-daily-rotate-file";

const {
    combine,
    timestamp,
    label,
    printf,
    colorize,
    prettyPrint,
    json,
    uncolorize
} = format;

// Directorio de logs
const __rootdir = path.resolve(process.cwd());
const logDir = path.join(__rootdir, "logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Esquema de colores
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue"
};
winston.addColors(colors);

// Formatos
const myConsoleFormat = combine(
    colorize({ all: true }),
    label({ label: "📢" }),
    timestamp({ format: "DD-MM-YY HH:mm:ss" }),
    printf((info) => `${info.level}; ${info.label}: ${info.timestamp}: ${info.message}`)
);

const myFileFormat = combine(
    uncolorize(),
    timestamp(),
    json()
);

// Opciones de transporte corregidas
const options = {
    errorFile: {
        level: "error",
        filename: path.join(logDir, "error.log"),
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
        filename: path.join(logDir, "app-readable.log"),
        level: "info",
        format: combine(
            uncolorize(),
            timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
            prettyPrint(),
        ),
        maxsize: 5242880,
        maxFiles: 5,
    },
    dailyRotateFile: {
        dirname: logDir, // Es mejor usar dirname para DailyRotate
        filename: "app-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        level: "info",
        format: myFileFormat,
    },
};

// Creación del logger
const logger = winston.createLogger({
    // Definimos niveles por si acaso, aunque Winston usa estos por defecto
    levels: winston.config.npm.levels,
    transports: [
        // 1. Rotación diaria (Usa la clase DailyRotateFile importada)
        new DailyRotateFile(options.dailyRotateFile),
        
        // 2. Archivo legible (Winston.transports.File con 's' al final)
        new winston.transports.File(options.readableFile),
        
        // 3. Log de errores
        new winston.transports.File(options.errorFile),
        
        // 4. Consola (Console con 'C' mayúscula)
        new winston.transports.Console(options.console)
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(logDir, "exceptions.log") })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(logDir, "rejections.log") })
    ],
    exitOnError: false
});

export default logger;