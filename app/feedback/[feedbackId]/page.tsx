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
      let status: "✅" | "⚠️" | "❌" = "❌";
      if (reason.startsWith("✅")) status = "✅";
      else if (reason.startsWith("⚠️")) status = "⚠️";
      return { skill, reason, status };
    });

  const mustHave = transformSection(feedbackData.mustHaves);
  const niceToHave = transformSection(feedbackData.niceToHaves);

  return (
    <FeedbackContent
      feedback={{
        fitScore,
        summary: feedbackData.summary,
        takeaways: feedbackData.takeaways,
        mustHave,
        niceToHave,
        jobId: feedbackData.jobId,
        feedbackId,
      }}
    />
  );
}
