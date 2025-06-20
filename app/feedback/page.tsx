// app/api/evaluate/route.ts

import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";
import parsePdf from "@/lib/pdfParser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function extractTextFromFile(fileUrl: string): Promise<string> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${fileUrl}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const parsedText = await parsePdf(buffer);
    console.log("📝 Extracted resume text (first 500 chars):", parsedText.slice(0, 500));
    return parsedText;
  } catch (err) {
    console.error("❌ PDF parsing failed:", err);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const { fileUrl, jobId } = await req.json();
    if (!fileUrl || !jobId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const resume = await extractTextFromFile(fileUrl);

    const { data, error } = await supabase
      .from("jobs")
      .select("title, must_have_skills, nice_to_have_skills")
      .filter("job_id", "ilike", jobId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const prompt = `
You are acting as an AI-powered job application reviewer. Your goal is to give clear, helpful, and concise feedback to a job seeker before they submit their application. This feedback is based off of information provided by the company of must have and nice to have requirements, not simply keywords.

You will be given:
- A job title
- A list of must-have requirements
- A list of nice-to-have qualifications
- A resume (as raw text)

---

### Please follow these steps:

Instructions:

1. Must-Have Requirements Check
For each must-have requirement, evaluate whether it is:
✅ Clearly demonstrated in experience or projects  
⚠️ Mentioned in the skills or summary section only  
❌ Not mentioned anywhere

2. Nice-to-Have Requirements Check
Same logic as above, slightly more forgiving.

3. Summary of Fit
Label as: "Strong Match", "Mixed Match", or "Unlikely to Proceed"

4. Suggestions for Improvement
- Give actionable advice for each ❌ or ⚠️
- Do not say "you do not have experience"
- Phrase constructively

---
Job Title: ${data.title}
Must-Have Requirements:
${data.must_have_skills}
Nice-to-Have Requirements:
${data.nice_to_have_skills}
Resume:
${resume}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const fullResponse = completion.choices?.[0]?.message?.content || "";

    let summary = "Mixed Match";
    if (/Strong Match/i.test(fullResponse)) {
      summary = "Strong Match";
    } else if (/Unlikely to Proceed/i.test(fullResponse)) {
      summary = "Unlikely to Proceed";
    }

    const insertResult = await supabase
      .from("feedback")
      .insert({
        job_id: jobId,
        match_rating: summary,
        full_feedback: fullResponse,
      })
      .select("feedback_id")
      .single();

    if (insertResult.error) {
      console.error("❌ Failed to save feedback:", insertResult.error);
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }

    return NextResponse.json({ feedbackId: insertResult.data.feedback_id });
  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}
