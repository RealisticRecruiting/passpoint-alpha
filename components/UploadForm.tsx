import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/utils/uploadthing";

type UploadFormProps = {
  jobId: string;
};

export function UploadForm({ jobId }: UploadFormProps) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="resumeUploader"
      onClientUploadComplete={(res) => {
        console.log("Upload complete!", res, "for job:", jobId);
      }}
      onUploadError={(error) => {
        console.error("Upload error", error);
      }}
    />
  );
}
