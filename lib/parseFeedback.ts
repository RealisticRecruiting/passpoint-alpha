type Requirement = {
  skill: string;
  status: "✅" | "⚠️" | "❌";
  reason?: string;
};

type FeedbackParsed = {
  fitScore: "high" | "medium" | "low";
  summary: string;
  mustHave: Requirement[];
  niceToHave: Requirement[];
  jobId: string;
};

export function parseFullFeedbackText(
  raw: string,
  jobId: string
): FeedbackParsed {
  // Default empty values
  const mustHave: Requirement[] = [];
  const niceToHave: Requirement[] = [];
  let fitScore: "high" | "medium" | "low" = "medium"; // default fallback
  let summary = "";

  // Use regex to find sections in raw text (markdown style)
  const mustHaveSection = raw.match(/#### Must-Have Requirements Check([\s\S]*?)####/);
  const niceToHaveSection = raw.match(/#### Nice-to-Have Requirements Check([\s\S]*?)####/);
  const summarySection = raw.match(/#### Summary of Fit([\s\S]*?)(####|$)/);

  // Helper to parse skills lines like "✅ Python  - reason text"
  function parseSkills(text: string): Requirement[] {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const statusMatch = line.match(/^(✅|⚠️|❌)/);
        const skillMatch = line.match(/^\s*(✅|⚠️|❌)\s*(.+?)(?:\s+-\s+(.+))?$/);
        if (!statusMatch || !skillMatch) {
          return null;
        }
        return {
          status: statusMatch[1] as "✅" | "⚠️" | "❌",
          skill: skillMatch[2].trim(),
          reason: skillMatch[3]?.trim() ?? "",
        };
      })
      .filter(Boolean) as Requirement[];
  }

  if (mustHaveSection) {
    mustHave.push(...parseSkills(mustHaveSection[1]));
  }

  if (niceToHaveSection) {
    niceToHave.push(...parseSkills(niceToHaveSection[1]));
  }

  if (summarySection) {
    summary = summarySection[1].trim();

    // Normalize summary text to match your UI enum
    if (/strong match/i.test(summary)) fitScore = "high";
    else if (/unlikely to proceed/i.test(summary)) fitScore = "low";
    else fitScore = "medium";
  }

  return {
    fitScore,
    summary,
    mustHave,
    niceToHave,
    jobId,
  };
}
