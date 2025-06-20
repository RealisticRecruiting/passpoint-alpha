// lib/pdfParser.ts
const PDFParser = require("pdf2json");

export default function parsePdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));

pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
  const rawText = pdfData?.formImage?.Pages?.map((page: any) =>
    page.Texts?.map((text: any) =>
      decodeURIComponent(text.R?.map((r: any) => r.T).join("") ?? "")
    ).join(" ")
  ).join("\n");

  resolve(rawText);
});


    pdfParser.parseBuffer(buffer);
  });
}
