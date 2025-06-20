
// TEMP: Forcing git to recognize change
export const dynamic = 'force-dynamic';

import { getJobById } from '@/lib/supabase';
import { UploadForm } from '@/components/UploadForm';

export default async function JobPage({ params }: { params: { jobId: string } }) {
  const job = await getJobById(params.jobId);

  if (!job || !job.job_url) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Job Not Found</h1>
        <p>This job either doesn't exist or is missing a redirect link.</p>
      </div>
    );
  }

  return (
    <main className="bg-[#f0efec] min-h-screen px-6 py-12 text-[#0b0604]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#153f4d]">{job.title || 'Untitled Role'}</h1>
        <UploadForm jobId={params.jobId} />

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2 text-[#153f4d]">Job Description</h2>
          <iframe
            src={job.job_url}
            width="100%"
            height="800"
            className="border border-gray-300 rounded"
            title="Job Description"
          />
        </section>
      </div>
    </main>
  );
}
