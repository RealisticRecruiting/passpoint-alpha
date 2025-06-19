// app/jobs/[jobId]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { UploadForm } from "@/components/UploadForm";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function JobPage({ params }: { params: { jobId: string } }) {
  const { data, error } = await supabase
    .from("jobs")
    .select("title, description")
    .eq("job_id", params.jobId.toLowerCase())
    .single();

  if (error || !data) {
    return <div className="p-8 text-red-600">Job not found.</div>;
  }

  return (
    <main className="bg-[#f0efec] min-h-screen px-6 py-12 text-[#0b0604]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#153f4d]">{data.title}</h1>

        {/* Upload CTA */}
        <UploadForm jobId={params.jobId} />

        {/* Job Description */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-2 text-[#153f4d]">Job Description</h2>
          <p className="whitespace-pre-line">{data.description}</p>
        </section>
      </div>
    </main>
  );
}
