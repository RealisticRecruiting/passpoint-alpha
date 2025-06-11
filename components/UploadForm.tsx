import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../utils/uploadthing";

export default function UploadForm() {
  return (
    <UploadButton<OurFileRouter, "resumeUploader">
      endpoint="resumeUploader"
      onClientUploadComplete={(res) => {
        console.log("✅ Upload complete", res);
        // trigger any GPT evaluation logic here
      }}
      onUploadError={(error) => {
        console.error("Upload failed:", error.message);
      }}
    />
  );
}
