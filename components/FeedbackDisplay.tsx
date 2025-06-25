"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Requirement = {
  skill: string;
  status: "✅" | "⚠️" | "❌";
  reason?: string;
};

type Feedback = {
  fitScore: "high" | "medium" | "low";
  summary: string;
  mustHave: Requirement[];
  niceToHave: Requirement[];
  jobId: string;
  takeaways: string[];
  feedbackId: string;
};

async function handleActionClick(feedbackId: string, actionType: string)
 {
  console.log("➡️ handleActionClick called with:", feedbackId, actionType);

  if (!feedbackId) {
    console.error("❌ Missing feedbackId, can't log action");
    return;
  }

  try {
  const res = await fetch("/api/log-action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ feedbackId, actionType }),
  });

  const data = await res.json();
  console.log("🔁 Log Action Response:", data);

  if (!res.ok) {
    console.error("❌ API call failed:", data.error || res.statusText);
  }
} catch (err) {
  console.error("❌ Fetch threw an error:", err);
}

}

export default function FeedbackDisplay({ feedback }: { feedback: Feedback }) {
  const fitScoreColors = {
    low: "bg-red-500",
    medium: "bg-yellow-400",
    high: "bg-green-500",
  };

  const fitScoreLabels = {
    low: "Low likelihood of next steps",
    medium: "Medium likelihood of next steps",
    high: "High likelihood of next steps",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      {!feedback.feedbackId && (
        <div className="text-red-600 font-bold mb-4">
          ⚠️ Feedback ID is missing — actions won’t work
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Application Feedback</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="mb-4 text-gray-700">
            PassPoint analyzes your resume against the job requirements, focusing on demonstrated skills rather than simple keyword matching.
          </p>

          {/* Fit Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Fit Score:</span>
              <Badge variant="secondary" className="uppercase font-bold">
                {feedback.fitScore}
              </Badge>
            </div>
            <div className="w-full h-4 rounded bg-gray-300">
              <div
                className={`${fitScoreColors[feedback.fitScore]} h-4 rounded transition-all duration-500`}
                style={{
                  width:
                    feedback.fitScore === "low"
                      ? "25%"
                      : feedback.fitScore === "medium"
                      ? "60%"
                      : "90%",
                }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 italic">{fitScoreLabels[feedback.fitScore]}</p>
            <p className="mt-2 text-xs text-gray-400 italic">
              This is an AI-generated estimate. Actual interview chances depend on many factors.
            </p>
          </div>

          {/* Takeaways */}
          <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
            <h2 className="text-lg font-semibold mb-2">Top Takeaways</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-800">
              {feedback.takeaways.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <Accordion type="multiple">
            <AccordionItem value="mustHave">
              <AccordionTrigger>
                Must-Have Requirements ({feedback.mustHave.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {feedback.mustHave.map(({ skill, status, reason }) => (
                    <li key={skill} className="text-gray-900">
                      <span className="font-semibold">{status} {skill}</span>
                      {reason && (
                        <span className="text-gray-600 ml-2 italic text-sm">- {reason}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="niceToHave">
              <AccordionTrigger>
                Nice-to-Have Requirements ({feedback.niceToHave.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {feedback.niceToHave.map(({ skill, status, reason }) => (
                    <li key={skill} className="text-gray-900">
                      <span className="font-semibold">{status} {skill}</span>
                      {reason && (
                        <span className="text-gray-600 ml-2 italic text-sm">- {reason}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Centered, spaced buttons */}
          <div className="flex flex-wrap gap-4 mt-8 justify-center">

  <button
  className="px-5 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm font-medium border"
  onClick={async () => {
    await handleActionClick(feedback.feedbackId, "update_resume");
    window.location.href = `/jobs/${feedback.jobId}?mode=upload`;
  }}
>
  Update Resume & Check Again
</button>

<button
  className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
  onClick={() => {
    handleActionClick(feedback.feedbackId, "apply");
    window.location.href = `/jobs/${feedback.jobId}`;
  }}
>
  Apply To The Job
</button>

  <button
  className="px-5 py-2 rounded bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium border"
  onClick={() => {
    handleActionClick(feedback.feedbackId, "exit");
    window.location.href = "/resources";
  }}
>
  Exit Without Applying
</button>



</div>

        </CardContent>
      </Card>
    </div>
  );
}
