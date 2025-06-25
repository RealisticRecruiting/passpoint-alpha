import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getJobById(jobId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('job_url, title') // <-- include title
    .eq('job_id', jobId.toLowerCase())
    .single();

  if (error || !data) return null;
  return data;
}

