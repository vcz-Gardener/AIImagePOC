import { Router, Request, Response } from 'express';
import axios from 'axios';
import { env } from '../config/env';

const router = Router();

interface ImageRequest {
  prompt: string;
  model?: string;
}

interface ImageResponse {
  imageUrl: string;
  status: string;
}

router.post('/image', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, model = 'gemini-pro-vision' }: ImageRequest = req.body;

    if (!prompt) {
      res.status(400).json({
        error: 'Prompt is required',
        message: '프롬프트를 입력해주세요.'
      });
      return;
    }

    if (!env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'API key not configured',
        message: 'GEMINI_API_KEY가 설정되지 않았습니다. .env 파일에 API 키를 추가해주세요.'
      });
      return;
    }

    console.log(`🖼️  Gemini 이미지 생성 요청: "${prompt}"`);

    // Google Gemini API 호출
    // 실제 Gemini API 엔드포인트는 공식 문서 확인 필요
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `Create an image based on this description: ${prompt}`
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const result: ImageResponse = {
      imageUrl: response.data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      status: 'success',
    };

    console.log(`✅ Gemini 이미지 생성 성공`);

    res.json(result);
  } catch (error) {
    console.error('❌ Gemini API 오류:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error?.message || error.message;

      res.status(status).json({
        error: 'Gemini API 오류',
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
