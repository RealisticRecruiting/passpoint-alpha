// app/feedback/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export default async function FeedbackPage() {
  const { data, error } = await supabase.from("feedback").select("id").limit(20);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load feedback list: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        No feedback entries found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Feedback List</h1>
      <ul className="list-disc pl-5 space-y-2">
        {data.map(({ id }) => (
          <li key={id}>
            <Link
              href={`/feedback/${id}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Feedback ID: {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
