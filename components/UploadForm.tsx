import { UploadButton } from "@uploadthing/react"; // no @ in version 7+
import type { OurFileRouter } from "@/utils/uploadthing";

export function UploadForm() {
  return (
    <UploadButton<OurFileRouter, "resumeUploader">
      endpoint="resumeUploader"
      onClientUploadComplete={(res) => {
        console.log("Upload complete!", res);
      }}
      onUploadError={(error) => {
        console.error("Upload error", error);
      }}
    />
  );
}
