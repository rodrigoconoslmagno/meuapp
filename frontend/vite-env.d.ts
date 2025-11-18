/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // você pode declarar outras variáveis aqui se quiser
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }