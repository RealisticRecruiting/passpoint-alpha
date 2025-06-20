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
  const parsedText = await parsePdf(buffer);
  console.log("📝 Extracted resume text (first 500 chars):", parsedText.slice(0, 500));
  return parsedText;
}

export async function POST(req: Request) {
  try {
    // 1. Log raw body for troubleshooting
    const rawBody = await req.text();
    console.log("📥 Incoming raw request body:", rawBody);

    const { fileUrl, jobId } = JSON.parse(rawBody);

    if (!fileUrl || !jobId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // 2. Extract resume text and log snippet
    const resume = await extractTextFromFile(fileUrl);

    // 3. Fetch job info from Supabase and log result
    const { data, error } = await supabase
      .from("jobs")
      .select("title, must_have_skills, nice_to_have_skills")
      .filter("job_id", "ilike", jobId)
      .single();

    console.log("📦 Supabase job fetch result:", { data, error });

    if (error || !data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Construct prompt here (omitted for brevity, keep your current prompt)

    const prompt = `
    ... your full prompt with embedded ${data.title}, etc ...
    `;

    // 4. Call OpenAI and log full response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const fullResponse = completion.choices?.[0]?.message?.content || "";
    console.log("📤 GPT Response:", fullResponse);

    // Decide summary
    let summary = "Mixed Match";
    if (/Strong Match/i.test(fullResponse)) summary = "Strong Match";
    else if (/Unlikely to Proceed/i.test(fullResponse)) summary = "Unlikely to Proceed";

    // 5. Save feedback and log insert result
    const { data: insertedFeedback, error: insertError } = await supabase
      .from('feedback')
      .insert({
        full_feedback: fullResponse,
        summary,
        job_id: jobId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    console.log("💾 Insert feedback result:", { insertedFeedback, insertError });

    if (insertError) {
      console.error("Failed to save feedback:", insertError);
      // Return feedback anyway even if insert failed
      return NextResponse.json({ feedback: fullResponse, summary });
    }

    // Return response including feedbackId
    return NextResponse.json({ feedback: fullResponse, summary, feedbackId: insertedFeedback.id });

  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}
