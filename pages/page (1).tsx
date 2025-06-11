// pages/feedback.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    const { feedback: encodedFeedback, summary } = router.query;

    if (typeof encodedFeedback === "string") {
      try {
        const decoded = decodeURIComponent(encodedFeedback);
        setFeedback(decoded);
      } catch (err) {
        setFeedback("There was an error decoding your feedback.");
      }
    }

    if (typeof summary === "string") {
      setSummary(summary);
    }
  }, [router.query]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Thanks for applying!</h1>
      {summary && <h2>Match Rating: {summary}</h2>}
      <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f4f4f4", padding: "1rem" }}>
        {feedback || "Loading..."}
      </pre>
    </div>
  );
}
