export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { getJobById } from '@/lib/supabase';

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

  redirect(job.job_url);
}
