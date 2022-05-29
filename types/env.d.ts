/// <reference types="vite/client" />

declare interface Window {
  [key: string]: any
  AMap: any
  onAMapLoaded: () => any
}
