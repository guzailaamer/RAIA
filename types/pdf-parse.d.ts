declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    info: any;
    metadata: any;
    version: string;
    numpages: number;
  }

  function pdf(dataBuffer: Buffer): Promise<PDFData>;
  export = pdf;
} 