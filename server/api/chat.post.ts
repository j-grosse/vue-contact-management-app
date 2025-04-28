// Nuxt api endpoint for chatbot requests
// This endpoint handles requests to the Gemini API for generating text responses
// It reads the prompt from the request body, sends it to the Gemini API,
// and returns the generated text response.
// The endpoint is defined using the `defineEventHandler` function from the H3 library.

import { H3Event, readBody, createError } from 'h3';

interface GeminiCandidate {
  content: {
    parts: Array<{ text: string }>;
  };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Read the request body and extract the prompt
    const body = await readBody(event);
    const prompt = body.prompt;

    // Get your Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY environment variable.');
    }

    // Build the request payload using the structure required by Gemini
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    // Call the Gemini API endpoint
    const response = await $fetch<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Extract the generated text from the response.
    // Gemini returns a "candidates" array with "parts".
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts || !parts.length) {
      throw new Error('No output received from Gemini model.');
    }

    // Join the parts into a single string.
    const candidateText = parts
      .map((p: any) => p.text)
      .join(' ')
      .trim();

    // Remove the prompt if it was echoed back
    const answer = candidateText.startsWith(prompt)
      ? candidateText.slice(prompt.length).trim()
      : candidateText;

    return { text: answer };
  } catch (error: any) {
    console.error('Chat API error:', error);
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
