import { Router, Request, Response } from 'express';
import axios from 'axios';
import { env } from '../config/env';

const router = Router();

interface GrokRequest {
  prompt: string;
  n?: number; // 생성할 이미지 개수 (1-10)
}

interface GrokResponse {
  images: string[];
  status: string;
}

router.post('/grok', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, n = 1 }: GrokRequest = req.body;

    if (!prompt) {
      res.status(400).json({
        error: 'Prompt is required',
        message: '프롬프트를 입력해주세요.'
      });
      return;
    }

    if (n < 1 || n > 10) {
      res.status(400).json({
        error: 'Invalid parameter',
        message: '이미지 개수는 1~10개 사이여야 합니다.'
      });
      return;
    }

    console.log(`🤖 Grok 이미지 생성 요청: "${prompt}" (${n}개)`);

    // Puter.js 무료 API를 통한 Grok 호출
    const response = await axios.post(
      'https://api.puter.com/drivers/call',
      {
        interface: 'puter-chat-completion',
        driver: 'grok',
        method: 'complete',
        args: {
          messages: [
            {
              role: 'user',
              content: `Generate an image: ${prompt}`
            }
          ],
          stream: false,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // Grok은 이미지 생성이 느릴 수 있음
      }
    );

    // 응답에서 이미지 URL 추출
    let images: string[] = [];
    const responseData = response.data;

    // Puter API 응답 구조에 따라 파싱
    if (responseData.result?.images) {
      images = Array.isArray(responseData.result.images)
        ? responseData.result.images
        : [responseData.result.images];
    } else if (responseData.result?.url) {
      images = [responseData.result.url];
    } else if (responseData.message?.content) {
      // 텍스트 응답에서 이미지 URL 추출 시도
      const urlMatch = responseData.message.content.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        images = [urlMatch[0]];
      }
    }

    if (images.length === 0) {
      res.status(503).json({
        error: 'Image generation unavailable',
        message: 'Grok 이미지 생성은 현재 직접 API 키가 필요합니다. Puter를 통한 무료 접근이 제한되어 있습니다.'
      });
      return;
    }

    const result: GrokResponse = {
      images,
      status: 'success',
    };

    console.log(`✅ Grok 이미지 생성 성공! ${images.length}개 이미지`);
    images.forEach((url, idx) => {
      console.log(`   이미지 ${idx + 1}: ${url}`);
    });

    res.json(result);
  } catch (error) {
    console.error('❌ Grok API 오류:', error);

    if (axios.isAxiosError(error)) {
      res.status(503).json({
        error: 'Grok service unavailable',
        message: 'Grok 이미지 생성 서비스를 사용할 수 없습니다. 직접 xAI API 키가 필요합니다.',
      });
    } else {
      res.status(500).json({
        error: 'Grok API error',
        message: error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
      });
    }
  }
});

export default router;
