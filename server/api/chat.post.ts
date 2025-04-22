import { H3Event, readBody, createError } from 'h3';
import { HfInference } from '@huggingface/inference';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const prompt = body.prompt;

    if (!process.env.HF_API_KEY) {
      throw new Error('Missing HF_API_KEY environment variable.');
    }

    const hf = new HfInference(process.env.HF_API_KEY);
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.1, // creativity
        top_k: 30, // Lowered to reduce randomness
        top_p: 0.85, // Adjusted for better coherence
        repetition_penalty: 1.5, // discourage repetition
        do_sample: true,
      },
    });

    return { text: response.generated_text };
  } catch (error: any) {
    console.error('Chat API error:', error);
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
