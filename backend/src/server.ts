import express, { Application } from 'express';
import cors from 'cors';
import { env, validateEnv } from './config/env';
import webtoonRouter from './routes/webtoon';
import imageRouter from './routes/image';
import animeRouter from './routes/anime';
import promptRouter from './routes/prompt';
import grokRouter from './routes/grok';

const app: Application = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Image POC Backend Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', webtoonRouter);
app.use('/api', imageRouter);
app.use('/api', animeRouter);
app.use('/api', grokRouter);
app.use('/api/prompt', promptRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: '요청한 엔드포인트를 찾을 수 없습니다.',
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start server
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log('\n🚀 AI Image POC Backend Server');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log('\n📡 Available endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/webtoon - LlamaGen 웹툰 생성`);
  console.log(`   POST http://localhost:${PORT}/api/image - Gemini 이미지 생성`);
  console.log(`   POST http://localhost:${PORT}/api/grok - Grok 이미지 생성 (무료)`);
  console.log(`   POST http://localhost:${PORT}/api/anime - KusaPics 정보`);
  console.log(`   POST http://localhost:${PORT}/api/prompt/enhance - 프롬프트 확장 (Groq/Gemini)`);

  validateEnv();

  console.log('\n✨ Backend server is ready!\n');
});

export default app;
