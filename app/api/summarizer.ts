// pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { description } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-davinci-003', // or any model you prefer
        prompt: `Summarize the following description:\n\n${description}`,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    res.status(200).json({ summary: data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize' });
  }
}
