"use client";

import { useState } from "react";
import Link from "next/link";
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
};

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

  const nextStepButtons = {
    high: (
      <Button asChild>
        <Link href={`/jobs/${feedback.jobId}`} className="w-full text-center">
          Apply to the Job!
        </Link>
      </Button>
    ),
    medium: (
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => alert("Feature coming soon: Resume update & re-check")}
          className="flex-1"
        >
          Update Resume & Check Again
        </Button>
        <Button asChild variant="secondary" className="flex-1">
          <Link href={`/jobs/${feedback.jobId}`}>Apply Anyway</Link>
        </Button>
      </div>
    ),
    low: (
      <Button asChild variant="destructive" className="w-full">
        <Link href="/resources">Explore Better Matches</Link>
      </Button>
    ),
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Application Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-700">
            PassPoint analyzes your resume against the job requirements, focusing on demonstrated skills rather than simple keyword matching.
          </p>

          {/* Fit Score Bar */}
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

          {/* Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
  <h2 className="text-lg font-semibold mb-2">Top Takeaways</h2>
  <ul className="list-disc pl-5 space-y-1 text-gray-800">
    {feedback.takeaways.map((tip, idx) => (
      <li key={idx}>{tip}</li>
    ))}
  </ul>
</div>




          {/* Requirements Checklists */}
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
        </CardContent>
      </Card>

      {/* Next Steps Button(s) */}
      <div>{nextStepButtons[feedback.fitScore]}</div>
    </div>
  );
}
