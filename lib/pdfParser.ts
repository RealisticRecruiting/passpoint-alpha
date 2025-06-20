// lib/pdfParser.ts
const PDFParser = require("pdf2json");

export default function parsePdf(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("❌ PDF parsing error:", errData.parserError);
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        if (!pdfData?.formImage?.Pages) {
          console.warn("⚠️ No pages found in PDF data");
          resolve("");
          return;
        }

        const rawStrings = pdfData.formImage.Pages.flatMap((page: any) =>
          page.Texts.flatMap((text: any) =>
            text.R.map((r: any) => r.T)
          )
        );

        console.log("📝 Raw extracted strings sample:", rawStrings.slice(0, 10));

        const decoded = rawStrings.map((str: string) => {
          try {
            return decodeURIComponent(str);
          } catch (e) {
            console.warn("⚠️ decodeURIComponent failed for string:", str, e);
            return "";
          }
        }).join(" ");

        console.log("📝 Decoded text sample (first 500 chars):", decoded.slice(0, 500));

        resolve(decoded);
      } catch (err) {
        console.error("❌ Unexpected error during PDF data processing:", err);
        reject(err);
      }
    });
console.log("📄 Buffer length:", buffer.length);
console.log("📄 Buffer first 30 bytes (utf-8):", buffer.slice(0, 30).toString("utf-8"));
console.log("📄 Buffer first 30 bytes (hex):", buffer.slice(0, 30).toString("hex"));

    pdfParser.parseBuffer(buffer);
  });
}
