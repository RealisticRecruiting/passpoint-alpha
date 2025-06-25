import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { feedbackId, action } = await req.json();

  if (!feedbackId || !action) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const { error } = await supabase.from("feedback_actions").insert({
    feedback_id: feedbackId,
    action,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to log action" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
