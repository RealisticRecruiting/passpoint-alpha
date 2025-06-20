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

        // Extract text per page, preserving word boundaries
        const pagesText = pdfData.formImage.Pages.map((page: any) => {
          return page.Texts
            .map((text: any) => {
              // Decode each text chunk (array of R)
              const decoded = text.R
                .map((r: any) => {
                  try {
                    return decodeURIComponent(r.T);
                  } catch (e) {
                    console.warn("⚠️ decodeURIComponent failed for string:", r.T, e);
                    return "";
                  }
                })
                .join("");
              return decoded;
            })
            .join(" "); // Join text chunks of a page with space to keep words together
        });

        const fullText = pagesText.join("\n"); // Join pages with newline

        console.log("📝 Extracted text sample (first 500 chars):", fullText.slice(0, 500));

        resolve(fullText);
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
