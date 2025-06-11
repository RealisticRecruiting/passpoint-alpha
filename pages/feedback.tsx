import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FeedbackPage() {
  const router = useRouter();
  const { summary, feedback } = router.query;

  const [parsedSummary, setParsedSummary] = useState<string>("");
  const [parsedFeedback, setParsedFeedback] = useState<string>("");

  useEffect(() => {
    if (typeof summary === "string") setParsedSummary(summary);
    if (typeof feedback === "string") setParsedFeedback(feedback);
  }, [summary, feedback]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>✅ Resume Review Complete</h1>

      <h2 style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
        📝 Summary of Fit: <span style={{ color: "#0070f3" }}>{parsedSummary || "N/A"}</span>
      </h2>

      <div
        style={{
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "6px",
          padding: "1rem",
          marginTop: "1rem",
          whiteSpace: "pre-wrap",
        }}
      >
        {parsedFeedback || "No feedback available."}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>
          ← Back to Job Listings
        </a>
      </div>
    </div>
  );
}
