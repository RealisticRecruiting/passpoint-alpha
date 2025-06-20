import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchFeedback(feedbackId: string) {
  const { data, error } = await supabase
    .from("feedback")
    .select("feedback_id, full_feedback, summary, job_id")
    .eq("id", feedbackId)
    .single();

  if (error || !data) {
    throw new Error(`Feedback not found for ID: ${feedbackId}`);
  }

  return data;
}

export default async function FeedbackPage({ params }: { params: { feedbackId: string } }) {
  const { feedbackId } = params;

  return (
    <Suspense fallback={<div className="p-6 text-gray-700">Loading feedback...</div>}>
      <FeedbackContent feedbackId={feedbackId} />
    </Suspense>
  );
}

async function FeedbackContent({ feedbackId }: { feedbackId: string }) {
  let feedbackData;
  try {
    feedbackData = await fetchFeedback(feedbackId);
  } catch (err: any) {
    return (
      <div className="p-6 text-red-600">
        Error loading feedback: {err.message || "Unknown error"}
        <br />
        <Link href="/jobs" className="underline text-blue-600 hover:text-blue-800 mt-4 block">
          &larr; Back to Jobs
        </Link>
      </div>
    );
  }

  if (!feedbackData?.full_feedback) {
    return (
      <div className="p-6 text-red-600">
        No feedback found.
        <br />
        <Link href="/jobs" className="underline text-blue-600 hover:text-blue-800 mt-4 block">
          &larr; Back to Jobs
        </Link>
      </div>
    );
  }

  // Build back-to-job link with fallback to /jobs if no job_id
  const backLink = feedbackData.job_id ? `/jobs/${feedbackData.job_id}` : "/jobs";

  return (
    <div className="p-6 prose max-w-3xl mx-auto">
      <h1>Resume Feedback</h1>

      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">{feedbackData.full_feedback}</pre>

      {feedbackData.summary && (
        <p className="mt-4 font-semibold">
          <strong>Summary of Fit:</strong> {feedbackData.summary}
        </p>
      )}

      <Link href={backLink} className="underline text-blue-600 hover:text-blue-800 mt-8 block">
        &larr; Back to Job
      </Link>
    </div>
  );
}
