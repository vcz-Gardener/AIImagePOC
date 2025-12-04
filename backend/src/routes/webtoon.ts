import { Router, Request, Response } from 'express';
import axios from 'axios';
import { env } from '../config/env';

const router = Router();

interface WebtoonRequest {
  prompt: string;
  model?: string;
  size?: string;
}

interface WebtoonResponse {
  imageId: string;
  imageUrl?: string;
  panels?: string[];
  status: string;
}

router.post('/webtoon', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, model = 'cyani-model', size = '1024x1024' }: WebtoonRequest = req.body;

    if (!prompt) {
      res.status(400).json({
        error: 'Prompt is required',
        message: '프롬프트를 입력해주세요.'
      });
      return;
    }

    if (!env.LLAMAGEN_API_KEY) {
      res.status(500).json({
        error: 'API key not configured',
        message: 'LLAMAGEN_API_KEY가 설정되지 않았습니다. .env 파일에 API 키를 추가해주세요.'
      });
      return;
    }

    console.log(`🎨 LlamaGen 웹툰 생성 요청: "${prompt}"`);

    // Step 1: 이미지 생성 요청
    const createResponse = await axios.post(
      'https://api.llamagen.ai/v1/comics/generations',
      {
        model,
        prompt,
        size,
      },
      {
        headers: {
          'Authorization': `Bearer ${env.LLAMAGEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const imageId = createResponse.data.id;
    console.log(`📝 생성 요청 완료, 이미지 ID: ${imageId}`);

    // Step 2: 이미지 URL 가져오기 (폴링)
    let panels: string[] = [];
    let attempts = 0;
    const maxAttempts = 30; // 최대 30초 대기

    while (attempts < maxAttempts && panels.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기

      try {
        const fetchResponse = await axios.get(
          `https://api.llamagen.ai/v1/comics/generations/${imageId}`,
          {
            headers: {
              'Authorization': `Bearer ${env.LLAMAGEN_API_KEY}`,
            },
            timeout: 10000,
          }
        );

        const data = fetchResponse.data;
        const status = data.status;

        console.log(`📊 상태: ${status}`);

        if (status === 'PROCESSED') {
          // LlamaGen은 여러 패널을 가진 웹툰을 생성
          // 모든 패널의 이미지 URL을 배열로 저장
          if (data.comics?.[0]?.panels) {
            panels = data.comics[0].panels
              .map((panel: { assetUrl: string }) => panel.assetUrl)
              .filter((url: string) => url); // 빈 URL 제거

            console.log(`✅ 웹툰 생성 완료! 패널 수: ${panels.length}`);
            panels.forEach((url, idx) => {
              console.log(`   패널 ${idx + 1}: ${url}`);
            });
          }
        } else if (status === 'FAILED' || status === 'ERROR') {
          throw new Error(`이미지 생성 실패: ${data.error || '알 수 없는 오류'}`);
        } else {
          console.log(`⏳ 이미지 생성 중... (상태: ${status}, 시도 ${attempts + 1}/${maxAttempts})`);
        }
      } catch (fetchError) {
        if (axios.isAxiosError(fetchError)) {
          console.log(`⏳ 이미지 생성 중... (시도 ${attempts + 1}/${maxAttempts}) - ${fetchError.message}`);
        } else {
          console.error(`❌ 폴링 오류:`, fetchError);
        }
      }

      attempts++;
    }

    if (panels.length === 0) {
      res.status(202).json({
        imageId,
        status: 'processing',
        message: `이미지가 생성 중입니다. ${maxAttempts}초 대기했지만 아직 완료되지 않았습니다.`,
      });
      return;
    }

    const result: WebtoonResponse = {
      imageId,
      imageUrl: panels[0], // 첫 번째 패널을 대표 이미지로
      panels, // 모든 패널 URL 배열
      status: 'success',
    };

    console.log(`✅ LlamaGen 웹툰 생성 성공! 총 ${panels.length}개 패널`);

    res.json(result);
  } catch (error) {
    console.error('❌ LlamaGen API 오류:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error?.message || error.message;

      res.status(status).json({
        error: 'LlamaGen API 오류',
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
