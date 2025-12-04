import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

export interface WebtoonResponse {
  imageId: string;
  imageUrl?: string;
  panels?: string[];
  status: string;
}

export interface ImageResponse {
  imageUrl: string;
  status: string;
}

export interface AnimeResponse {
  status: string;
  message: string;
  url: string;
  prompt: string;
}

export interface PromptResponse {
  enhancedPrompt: string;
  provider: string;
  status: string;
}

export interface GrokResponse {
  images: string[];
  status: string;
}

export async function generateWebtoon(prompt: string): Promise<WebtoonResponse> {
  try {
    const response = await axios.post<WebtoonResponse>(`${API_BASE_URL}/webtoon`, {
      prompt,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || axiosError.message);
    }
    throw error;
  }
}

export async function generateImage(prompt: string): Promise<ImageResponse> {
  try {
    const response = await axios.post<ImageResponse>(`${API_BASE_URL}/image`, {
      prompt,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || axiosError.message);
    }
    throw error;
  }
}

export async function getAnimeInfo(prompt: string): Promise<AnimeResponse> {
  try {
    const response = await axios.post<AnimeResponse>(`${API_BASE_URL}/anime`, {
      prompt,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || axiosError.message);
    }
    throw error;
  }
}

export async function enhancePrompt(keywords: string, provider: 'groq' | 'gemini' = 'groq'): Promise<PromptResponse> {
  try {
    const response = await axios.post<PromptResponse>(`${API_BASE_URL}/prompt/enhance`, {
      keywords,
      provider,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || axiosError.message);
    }
    throw error;
  }
}

export async function generateGrok(prompt: string, n: number = 1): Promise<GrokResponse> {
  try {
    const response = await axios.post<GrokResponse>(`${API_BASE_URL}/grok`, {
      prompt,
      n,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || axiosError.message);
    }
    throw error;
  }
}
