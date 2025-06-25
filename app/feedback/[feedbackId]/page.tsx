import { Suspense } from "react";
import FeedbackContent from "@/components/FeedbackDisplay";
import { fetchFeedback } from "@/lib/fetchFeedback";


export default async function FeedbackPage({
  params,
}: {
  params: { feedbackId: string };
}) {
  const { feedbackId } = params;

  const feedbackData = await fetchFeedback(feedbackId);

  if (!feedbackData) {
    return <div className="p-6 text-red-600">Feedback not found.</div>;
  }

  const fitScore =
    feedbackData.summary === "Strong Match"
      ? "high"
      : feedbackData.summary === "Mixed Match"
      ? "medium"
      : "low";

  const transformSection = (obj: Record<string, string>) =>
  Object.entries(obj).map(([skill, reason]) => {
    let status: "✅" | "⚠️" | "❌" = "❌"; // default to ❌
    if (reason.startsWith("✅")) status = "✅";
    else if (reason.startsWith("⚠️")) status = "⚠️";
    return {
      skill,
      reason,
      status,
    };
  });


  const mustHave = transformSection(feedbackData.mustHaves);
  const niceToHave = transformSection(feedbackData.niceToHaves);

  return (
  <Suspense fallback={<div className="p-6 text-gray-700">Loading feedback...</div>}>
    <FeedbackContent
      feedback={{
        fitScore,
        summary: feedbackData.summary,
 // use actual summary, not takeaways.join
        mustHave,
        niceToHave,
        jobId: feedbackData.jobId,
        takeaways: feedbackData.takeaways, // ← this was missing
      }}
    />
  </Suspense>
);
}
