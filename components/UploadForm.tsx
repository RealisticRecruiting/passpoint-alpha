"use client";

import { UploadButton } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import type { OurFileRouter } from "@/lib/core";
import { useState } from "react";

export default function UploadForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [uploadKey, setUploadKey] = useState(Date.now()); // triggers rerender

  return (
    <div className="my-6">
      <UploadButton<OurFileRouter, "resumeUploader">
        key={uploadKey} // 🚨 force new instance
        endpoint="resumeUploader"
        
        appearance={{
          button({ ready }) {
            return "bg-blue-600 text-white px-4 py-2 rounded " + (ready ? "" : "opacity-50");
          },
          container: "flex flex-col items-start",
          allowedContent: "text-sm text-gray-500",
        }}
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
                fileUrl: res[0].url ?? res[0].ufsUrl,

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
            const feedbackId = result.feedbackId;

            router.push(`/feedback/${feedbackId}`);
          } catch (error: any) {
            alert(`Upload or evaluation failed: ${error.message || error}`);
          } finally {
            setUploadKey(Date.now()); // 💥 Reset UploadButton for another round
          }
        }}
        onUploadError={(error: Error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
