import { supabase } from "./supabase";

export async function fetchFeedback(feedbackId: string) {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("feedback_id", feedbackId)
    .single();

  if (error || !data) {
    console.error("Failed to fetch feedback:", error);
    return null;
  }

  // Safe JSON parsing and typing
  type FeedbackJson = {
    mustHaves: Record<string, string>;
    niceToHaves: Record<string, string>;
    summary?: string;
    takeaways?: string[];
  };

  let parsedFeedback: FeedbackJson = {
    mustHaves: {},
    niceToHaves: {},
  };

  try {
    parsedFeedback = JSON.parse(data.full_feedback || "{}");
  } catch (err) {
    console.error("Error parsing full_feedback JSON:", err);
  }

  return {
    feedbackId: data.feedback_id,
    jobId: data.job_id,
    createdAt: data.created_at,
    summary: parsedFeedback.summary || "",
    takeaways: parsedFeedback.takeaways || [],
    mustHaves: parsedFeedback.mustHaves,
    niceToHaves: parsedFeedback.niceToHaves,
  };
}
