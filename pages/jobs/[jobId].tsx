import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../../utils/uploadthing";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JobPage() {
  const router = useRouter();
  const { jobId } = router.query;

  const [job, setJob] = useState<any>(null);
  const [fitSummary, setFitSummary] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!router.isReady || !jobId) return;

    supabase
  .from("jobs")
  .select("*")
  .ilike("job_id", `${jobId}`) 
  .then(({ data }) => {
    console.log("Final match:", data);
    setJob(data?.[0] || null);
  });

  }, [router.isReady, jobId]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Apply for: {job?.title || "..."}</h1>

      {job && (
        <>
          <p><strong>Must Haves:</strong> {job.must_have_skills}</p>
          <p><strong>Nice to Haves:</strong> {job.nice_to_have_skills}</p>
        </>
      )}

      {job?.job_url && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Job Details</h2>
          <iframe
            src={job.job_url}
            width="100%"
            height="800px"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}

      <hr style={{ margin: "1rem 0" }} />

      <h2>Upload Resume</h2>

      <UploadButton<OurFileRouter, "resumeUploader">
        endpoint="resumeUploader"
        onClientUploadComplete={async (res) => {
          const fileUrl = res?.[0]?.url || res?.[0]?.ufsUrl;
          if (!fileUrl) {
            alert("Error: Could not retrieve uploaded file URL.");
            return;
          }

          const response = await fetch("/api/evaluate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileUrl,
              jobId,
            }),
          });

          const data = await response.json();
          setFeedback(data.feedback);
          setFitSummary(data.summary);

          router.push(
            `/feedback?summary=${encodeURIComponent(data.summary)}&feedback=${encodeURIComponent(data.feedback)}`
          );
        }}
        onUploadError={(err) => alert(`Upload error: ${err.message}`)}
      />
    </div>
  );
}
