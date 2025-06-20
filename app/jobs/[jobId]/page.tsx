import { createClient } from "@supabase/supabase-js";
import UploadForm from "@/components/UploadForm"; // adjust if named export

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export default async function JobPage({ params }: { params: { jobId: string } }) {
  const { jobId } = params;

  const { data: job, error } = await supabase
    .from("jobs")
    .select("job_url")
    .eq("job_id", jobId)
    .single();

  if (error || !job?.job_url) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Job Not Found</h1>
        <p>This job either doesn't exist or is missing a redirect link.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <UploadForm jobId={jobId} />
      <p>
        <a href={job.job_url} target="_blank" rel="noopener noreferrer">
          View full job posting &rarr;
        </a>
      </p>
    </div>
  );
}
