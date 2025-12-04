import { Router, Request, Response } from 'express';
import axios from 'axios';
import { env } from '../config/env';

const router = Router();

interface PromptRequest {
  keywords: string;
  provider?: 'groq' | 'gemini';
}

interface PromptResponse {
  enhancedPrompt: string;
  provider: string;
  status: string;
}

const PROMPT_ENHANCEMENT_INSTRUCTION = `You are an expert AI image generation prompt engineer.
Transform the given keywords into a detailed, creative image generation prompt optimized for AI image models like DALL-E, Midjourney, or Stable Diffusion.

Guidelines:
- Include vivid visual details (colors, lighting, composition)
- Add artistic style if not specified (e.g., "digital art", "oil painting", "photorealistic")
- Specify mood and atmosphere
- Add technical details (e.g., "4K", "highly detailed", "trending on artstation")
- Keep it under 200 words
- Write in English

Respond ONLY with the enhanced prompt, no explanations.`;

router.post('/enhance', async (req: Request, res: Response): Promise<void> => {
  try {
    const { keywords, provider = 'groq' }: PromptRequest = req.body;

    if (!keywords || !keywords.trim()) {
      res.status(400).json({
        error: 'Keywords required',
        message: '키워드를 입력해주세요.'
      });
      return;
    }

    console.log(`✨ 프롬프트 확장 요청: "${keywords}" (provider: ${provider})`);

    let enhancedPrompt = '';

    if (provider === 'groq') {
      if (!env.GROQ_API_KEY) {
        res.status(500).json({
          error: 'API key not configured',
          message: 'GROQ_API_KEY가 설정되지 않았습니다. .env 파일에 API 키를 추가해주세요.'
        });
        return;
      }

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: PROMPT_ENHANCEMENT_INSTRUCTION
            },
            {
              role: 'user',
              content: keywords
            }
          ],
          temperature: 0.8,
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      enhancedPrompt = response.data.choices[0]?.message?.content?.trim() || '';
    } else if (provider === 'gemini') {
      if (!env.GEMINI_API_KEY) {
        res.status(500).json({
          error: 'API key not configured',
          message: 'GEMINI_API_KEY가 설정되지 않았습니다. .env 파일에 API 키를 추가해주세요.'
        });
        return;
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `${PROMPT_ENHANCEMENT_INSTRUCTION}\n\nKeywords: ${keywords}`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      enhancedPrompt = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    }

    if (!enhancedPrompt) {
      res.status(500).json({
        error: 'Enhancement failed',
        message: '프롬프트 확장에 실패했습니다.'
      });
      return;
    }

    const result: PromptResponse = {
      enhancedPrompt,
      provider,
      status: 'success',
    };

    console.log(`✅ 프롬프트 확장 완료 (${provider}): ${enhancedPrompt.substring(0, 50)}...`);

    res.json(result);
  } catch (error) {
    console.error('❌ 프롬프트 확장 오류:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error?.message || error.message;

      res.status(status).json({
        error: '프롬프트 확장 API 오류',
        message,
        details: error.response?.data,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: '서버 오류가 발생했습니다.',
      });
    }
  }
});

export default router;
