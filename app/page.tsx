import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function JobListPage() {
  const { data: jobs, error } = await supabase.from("jobs").select("job_id, title");

  if (error) {
    return <div className="p-8 text-red-600">Error loading jobs.</div>;
  }

  return (
    <main className="bg-[#f0efec] min-h-screen px-6 py-12 text-[#0b0604]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#153f4d]">Available Roles</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs?.map((job) => (
            <li key={job.job_id} className="bg-white p-4 rounded shadow border border-[#fcb33d]">
              <h2 className="text-lg font-semibold mb-2">{job.title}</h2>
              <Link href={`/jobs/${job.job_id}`} className="text-[#14a5c6] hover:underline">
                Try This Job
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
