"use client";

import { UploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import type { OurFileRouter } from "@/lib/core";

export default function UploadForm({ jobId }: { jobId: string }) {
  const router = useRouter();

  return (
    <div className="my-6">
      <UploadButton<OurFileRouter, "resumeUploader">
        endpoint="resumeUploader"
        onClientUploadComplete={async (res) => {
          if (!res || res.length === 0) {
            alert("Upload failed. No file returned.");
            return;
          }

          console.log("📤 Upload complete. File URL:", res[0].url);
          console.log("📌 Job ID being submitted for evaluation:", jobId);

          try {
            const response = await fetch("/api/evaluate", {
              method: "POST",
              body: JSON.stringify({
                fileUrl: res[0].url,
                jobId,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              alert("There was an error scoring your resume.");
              return;
            }

            const result = await response.json();
            console.log("API evaluate response:", result);

            const feedbackId = result.feedbackId;

            console.log("📝 Received feedback ID:", feedbackId);
            router.push(`/feedback/${feedbackId}`);
          } catch (error: any) {
            alert(`Upload or evaluation failed: ${error.message || error}`);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
