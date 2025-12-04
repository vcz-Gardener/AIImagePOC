'use client'

import { useState } from 'react'
import { enhancePrompt } from '@/lib/api'

type Provider = 'groq' | 'gemini'

export default function PromptEnhancer() {
  const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<Provider>('groq')
  const [copied, setCopied] = useState(false)

  const handleEnhance = async (selectedProvider: Provider) => {
    if (!keywords.trim()) {
      setError('키워드를 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    setEnhancedPrompt(null)
    setProvider(selectedProvider)
    setCopied(false)

    try {
      const response = await enhancePrompt(keywords, selectedProvider)
      if (response.enhancedPrompt) {
        setEnhancedPrompt(response.enhancedPrompt)
      } else {
        setError('프롬프트를 생성할 수 없습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!enhancedPrompt) return

    try {
      await navigator.clipboard.writeText(enhancedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError('클립보드 복사에 실패했습니다.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8">
        <div className="space-y-6">
          {/* Keywords Input */}
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              키워드 입력
            </label>
            <textarea
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 귀여운 고양이, 파란 하늘, 애니메이션 스타일"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Provider Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleEnhance('groq')}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && provider === 'groq' ? '생성 중...' : '🚀 Groq로 확장'}
            </button>

            <button
              onClick={() => handleEnhance('gemini')}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && provider === 'gemini' ? '생성 중...' : '✨ Gemini로 확장'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Enhanced Prompt Display */}
          {enhancedPrompt && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  확장된 프롬프트:
                </h3>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {copied ? '✓ 복사됨!' : '📋 복사'}
                </button>
              </div>
              <div className="relative w-full rounded-lg bg-gray-50 dark:bg-gray-700 p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {enhancedPrompt}
                </p>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  사용된 모델: <span className="font-semibold">{provider === 'groq' ? 'Groq (Llama 3.1)' : 'Google Gemini Flash'}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
