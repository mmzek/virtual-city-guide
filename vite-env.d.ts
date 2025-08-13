/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_KEY: string;
  readonly VITE_WEATHER_KEY: string;
  readonly VITE_GEOPIFY_KEY:string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
