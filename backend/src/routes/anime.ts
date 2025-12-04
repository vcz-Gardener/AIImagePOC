import { Router, Request, Response } from 'express';

const router = Router();

interface AnimeRequest {
  prompt: string;
}

// KusaPics는 별도 API가 없으므로 프론트엔드에서 iframe으로 처리
// 이 엔드포인트는 참고용으로만 제공
router.post('/anime', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt }: AnimeRequest = req.body;

    if (!prompt) {
      res.status(400).json({
        error: 'Prompt is required',
        message: '프롬프트를 입력해주세요.'
      });
      return;
    }

    console.log(`🎌 KusaPics 애니 생성 요청: "${prompt}"`);

    // KusaPics는 웹 기반 서비스로 API가 제공되지 않음
    // 프론트엔드에서 iframe으로 https://kusa.pics를 임베드하여 사용
    res.json({
      status: 'redirect',
      message: 'KusaPics는 웹 기반 서비스입니다. 프론트엔드에서 iframe으로 접근하세요.',
      url: 'https://kusa.pics',
      prompt,
    });
  } catch (error) {
    console.error('❌ KusaPics 처리 오류:', error);

    res.status(500).json({
      error: 'Internal server error',
      message: '서버 오류가 발생했습니다.',
    });
  }
});

export default router;
