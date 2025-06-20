import { createClient } from "@supabase/supabase-js";
import UploadForm from "@/components/UploadForm"; // default import
import { use } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

type Job = {
  job_url: string;
};

async function getJob(jobId: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("job_url")
    .eq("job_id", jobId)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function JobPage({ params }: { params: { jobId: string } }) {
  const job = await getJob(params.jobId);

  if (!job?.job_url) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Job Not Found</h1>
        <p>This job either doesn't exist or is missing a redirect link.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", fontFamily: "sans-serif" }}>
      {/* Upload Button */}
      <UploadForm jobId={params.jobId} />

      {/* iframe with the job posting */}
      <iframe
        src={job.job_url}
        style={{ width: "100%", height: "600px", border: "1px solid #ccc", marginTop: "1rem" }}
        title="Job Posting"
      />
    </div>
  );
}
