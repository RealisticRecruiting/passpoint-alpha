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
        if (!pdfData?.formImage) {
          console.warn("⚠️ No formImage in PDF data", JSON.stringify(pdfData).slice(0, 1000));
          resolve("");
          return;
        }

        if (!pdfData.formImage.Pages || pdfData.formImage.Pages.length === 0) {
          console.warn("⚠️ No pages found in PDF data", JSON.stringify(pdfData.formImage).slice(0, 1000));
          resolve("");
          return;
        }

        console.log(`📄 PDF contains ${pdfData.formImage.Pages.length} page(s)`);

        const rawStrings: string[] = [];

        pdfData.formImage.Pages.forEach((page: any, pageIndex: number) => {
          if (!page.Texts || page.Texts.length === 0) {
            console.warn(`⚠️ No Texts found on page ${pageIndex + 1}`);
            return;
          }
          page.Texts.forEach((text: any, textIndex: number) => {
            if (!text.R || text.R.length === 0) {
              console.warn(`⚠️ No R array found in Text #${textIndex + 1} on page ${pageIndex + 1}`);
              return;
            }
            text.R.forEach((r: any, rIndex: number) => {
              if (!r.T) {
                console.warn(`⚠️ Missing T property in R #${rIndex + 1} of Text #${textIndex + 1} on page ${pageIndex + 1}`);
                return;
              }
              rawStrings.push(r.T);
            });
          });
        });

        console.log("📝 Raw extracted strings sample:", rawStrings.slice(0, 10));

        const decoded = rawStrings.map((str: string, idx: number) => {
          try {
            return decodeURIComponent(str);
          } catch (e) {
            console.warn(`⚠️ decodeURIComponent failed for string #${idx}`, str, e);
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

    // Timeout fallback in case no event fires (optional)
    const timeoutId = setTimeout(() => {
      console.error("❌ PDF parsing timeout: no dataReady or dataError event fired");
      reject(new Error("PDF parsing timeout"));
    }, 15000);

    pdfParser.on("pdfParser_dataReady", () => clearTimeout(timeoutId));
    pdfParser.on("pdfParser_dataError", () => clearTimeout(timeoutId));

    pdfParser.parseBuffer(buffer);
  });
}
