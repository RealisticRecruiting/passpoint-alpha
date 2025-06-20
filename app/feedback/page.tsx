// app/feedback/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export default async function FeedbackPage() {
  const { data, error } = await supabase
    .from("feedback")
    .select("feedback_id, summary, job_id")
    .limit(20);

  if (error) {
    // handle error, e.g. throw or return an error UI
    throw new Error("Failed to load feedback list");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Feedback List</h1>
      <ul className="list-disc pl-5 space-y-2">
        {data.map(({ feedback_id, summary }) => (
          <li key={feedback_id}>
            <Link
              href={`/feedback/${feedback_id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Feedback Summary: {summary || feedback_id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
