import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function evaluateResumeWithGPT(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content || 'No response';
}
