'use client'

import { useState } from 'react'
import { generateWebtoon, generateImage, getAnimeInfo, generateGrok } from '@/lib/api'

type GenerationType = 'webtoon' | 'image' | 'grok' | 'anime' | null

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [panels, setPanels] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [generationType, setGenerationType] = useState<GenerationType>(null)
  const [showKusaPics, setShowKusaPics] = useState(false)

  const handleGenerate = async (type: 'webtoon' | 'image' | 'grok' | 'anime') => {
    if (!prompt.trim()) {
      setError('프롬프트를 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    setImageUrl(null)
    setPanels([])
    setGenerationType(type)
    setShowKusaPics(false)

    try {
      if (type === 'webtoon') {
        const response = await generateWebtoon(prompt)
        if (response.panels && response.panels.length > 0) {
          setPanels(response.panels)
          setImageUrl(response.panels[0]) // 대표 이미지
        } else if (response.imageUrl) {
          setImageUrl(response.imageUrl)
        } else {
          setError('이미지 URL을 가져올 수 없습니다.')
        }
      } else if (type === 'image') {
        const response = await generateImage(prompt)
        if (response.imageUrl) {
          setImageUrl(response.imageUrl)
        } else {
          setError('이미지 URL을 가져올 수 없습니다.')
        }
      } else if (type === 'grok') {
        const response = await generateGrok(prompt, 1)
        if (response.images && response.images.length > 0) {
          setImageUrl(response.images[0])
        } else {
          setError('이미지 URL을 가져올 수 없습니다.')
        }
      } else if (type === 'anime') {
        await getAnimeInfo(prompt)
        setShowKusaPics(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8">
        <div className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              프롬프트 입력
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 귀여운 고양이 캐릭터, 파란 하늘 배경"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleGenerate('webtoon')}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && generationType === 'webtoon' ? '생성 중...' : '🎭 LlamaGen'}
            </button>

            <button
              onClick={() => handleGenerate('image')}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && generationType === 'image' ? '생성 중...' : '🖼️ Nano Banana'}
            </button>

            <button
              onClick={() => handleGenerate('grok')}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && generationType === 'grok' ? '생성 중...' : '🤖 Grok (무료)'}
            </button>

            <button
              onClick={() => handleGenerate('anime')}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && generationType === 'anime' ? '로딩 중...' : '🎌 KusaPics'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Webtoon Panels Display */}
          {panels.length > 0 && !showKusaPics && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                생성된 웹툰 ({panels.length}개 패널):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {panels.map((panelUrl, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
                      패널 {idx + 1}
                    </div>
                    <img
                      src={panelUrl}
                      alt={`Panel ${idx + 1}`}
                      className="w-full h-auto"
                      onError={() => setError(`패널 ${idx + 1} 이미지를 불러올 수 없습니다.`)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  총 {panels.length}개 패널 생성 완료!
                </p>
                <details className="text-xs text-blue-700 dark:text-blue-300">
                  <summary className="cursor-pointer hover:underline">패널 URL 보기</summary>
                  <ul className="mt-2 space-y-1">
                    {panels.map((url, idx) => (
                      <li key={idx} className="break-all">
                        패널 {idx + 1}: <a href={url} target="_blank" rel="noopener noreferrer" className="underline">{url}</a>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          )}

          {/* Single Image Display (for non-webtoon) */}
          {imageUrl && panels.length === 0 && !showKusaPics && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                생성된 이미지:
              </h3>
              <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={imageUrl}
                  alt="Generated image"
                  className="w-full h-auto"
                  onError={() => setError('이미지를 불러올 수 없습니다.')}
                />
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 break-all">
                  이미지 URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">{imageUrl}</a>
                </p>
              </div>
            </div>
          )}

          {/* KusaPics iframe */}
          {showKusaPics && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                KusaPics 애니 생성기
              </h3>
              <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                <iframe
                  src="https://kusa.pics"
                  title="KusaPics"
                  className="absolute top-0 left-0 w-full h-full border-2 border-gray-300 dark:border-gray-600 rounded-lg"
                  allow="clipboard-write"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                위 창에서 직접 애니 이미지를 생성할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
