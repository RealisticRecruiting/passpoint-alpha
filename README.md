🧠 PassPoint: AI Resume Pre-Screening for Job Postings
PassPoint helps hiring teams screen resumes before candidates apply. Candidates upload a resume, PassPoint compares it to the job's requirements (from Supabase), and returns AI-generated, structured feedback including:

✅ / ⚠️ / ❌ scoring on each must-have and nice-to-have skill

A "fit score" (Strong / Mixed / Unlikely)

Human-readable takeaways to help candidates improve

🔧 Tech Stack
Next.js 15 + App Router

Supabase (Postgres DB + API)

UploadThing for file uploads

OpenAI GPT-4 for scoring/evaluation

PDF.js via custom parsePdf for resume text extraction

⚙️ Environment Variables
You'll need these in your .env.local:

bash
Copy
Edit
OPENAI_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
🚀 Running Locally
bash
Copy
Edit
npm install
npm run dev
Upload a resume via /jobs/[jobId] to test end-to-end.

🧪 Testing Feedback Flow
Ensure Supabase has a valid job record in the jobs table

Go to /jobs/[jobId] and upload a PDF resume

PassPoint scores the resume and stores structured feedback in Supabase

User is redirected to /feedback/[feedbackId] with results and next steps

📌 Current Stable Version
The current working version is tagged:
passpoint-stable
Use this if you need to revert.

