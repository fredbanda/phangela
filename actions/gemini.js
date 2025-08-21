"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Reusable function for generating text
export async function generateSummary(prompt) {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("❌ Gemini generation failed:", error);
    throw error;
  }
}

