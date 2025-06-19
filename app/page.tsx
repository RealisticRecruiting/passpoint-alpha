// app/page.tsx
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: jobs } = await supabase.from("jobs").select("job_id, title");

  return (
    <main className="bg-[#f0efec] min-h-screen px-6 py-12 text-[#0b0604]">
      <div className="max-w-4xl mx-auto">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#153f4d]">
            Get Resume Feedback Before You Apply
          </h1>
          <p className="text-lg mb-6">
            PassPoint scans your resume against real job requirements and tells
            you if you’re a strong match—before you hit submit.
          </p>
          <a
            href="#job-list"
            className="bg-[#14a5c6] hover:bg-[#153f4d] text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Try It Now
          </a>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-[#153f4d]">How It Works</h2>
          <ol className="space-y-3 text-[#0b0604]">
            <li><strong>1.</strong> Pick a job from the list below</li>
            <li><strong>2.</strong> Upload your resume</li>
            <li><strong>3.</strong> Get instant AI-powered feedback</li>
          </ol>
        </section>

        <section id="job-list">
          <h2 className="text-2xl font-semibold mb-4 text-[#153f4d]">Open Roles to Try</h2>
          {jobs && jobs.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <li
                  key={job.job_id}
                  className="bg-white shadow-md p-4 rounded-lg border border-[#fcb33d]"
                >
                  <h3 className="text-lg font-bold mb-2">{job.title}</h3>
                  <Link
                    className="text-[#14a5c6] hover:underline"
                    href={`/jobs/${job.job_id}`}
                  >
                    Try This Job
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No jobs available right now. Check back soon!</p>
          )}
        </section>

        <footer className="mt-20 text-center text-sm text-gray-500">
          <p>Made by Mike Peditto | Realistic Recruiting</p>
        </footer>
      </div>
    </main>
  );
}
