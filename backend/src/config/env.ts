import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Also try to load from root directory
dotenv.config({ path: path.join(__dirname, '../../../.env') });

export interface EnvConfig {
  LLAMAGEN_API_KEY: string;
  GEMINI_API_KEY: string;
  GROQ_API_KEY: string;
  PORT: number;
}

export const env: EnvConfig = {
  LLAMAGEN_API_KEY: process.env.LLAMAGEN_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  PORT: parseInt(process.env.PORT || '3001', 10),
};

export function validateEnv(): void {
  const warnings: string[] = [];

  if (!env.LLAMAGEN_API_KEY) {
    warnings.push('⚠️  LLAMAGEN_API_KEY is not set');
  }

  if (!env.GEMINI_API_KEY) {
    warnings.push('⚠️  GEMINI_API_KEY is not set');
  }

  if (warnings.length > 0) {
    console.warn('\n환경변수 경고:');
    warnings.forEach(warning => console.warn(warning));
    console.warn('\nAPI 키를 설정하려면 .env 파일을 생성하고 키를 입력하세요.');
    console.warn('참고: .env.example 파일을 복사하여 사용하세요.\n');
  }
}
