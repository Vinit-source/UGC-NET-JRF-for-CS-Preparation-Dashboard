import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { scores, focus, syllabus } = await req.json();

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

    const prompt = `
      You are an expert tutor for the UGC NET JRF examination.
      Analyze the student's current progress based on their test scores and focus areas.
      
      Scores data: ${JSON.stringify(scores)}
      Focus areas: ${JSON.stringify(focus)}
      
      Provide a concise, encouraging, and actionable analysis (max 3 paragraphs).
      Identify 2-3 specific topics they should focus on next, considering their low scores and high focus marks.
      Do not use markdown formatting like bold or headers, just plain text paragraphs.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
    });

    return NextResponse.json({ analysis: response.text });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
