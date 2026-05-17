/// <reference types="vite/client" />

declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
