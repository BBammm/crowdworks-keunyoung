/// <reference types="vite/client" />

declare module '*.pdf' {
  const src: string
  export default src
}

declare module 'pdfjs-dist/build/pdf.worker.min?url' {
  const workerUrl: string
  export default workerUrl
}