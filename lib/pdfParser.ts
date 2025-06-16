// lib/pdfParser.ts
const PDFParser = require("pdf2json");

export default function parsePdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      const rawText = pdfData?.formImage?.Pages?.map(page =>
        page.Texts?.map(text =>
          decodeURIComponent(text.R.map(r => r.T).join(""))
        ).join(" ")
      ).join("\n\n");

      resolve(rawText || "");
    });

    pdfParser.parseBuffer(buffer);
  });
}
