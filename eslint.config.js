import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1. Ignorar builds del front y dependencias
  {
    ignores: ["node_modules/**", "dist/**"]
  },
  
  // 2. Configurar el backend: server/**
  {
    files: ["server/**/*.{js,mjs,cjs}"],
    // Usamos el objeto importado directamente sin comillas
    rules: {
       ...js.configs.recommended.rules,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node }
    }
  },

  // 3. Configurar el front-end: src
  {
    files: ["src/**/*.{js,mjs,cjs}"],
    rules: {
       ...js.configs.recommended.rules,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser }
    }
  }
]);