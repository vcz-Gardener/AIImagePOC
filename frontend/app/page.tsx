'use client'

import { useState } from 'react'
import ImageGenerator from '@/components/ImageGenerator'
import PromptEnhancer from '@/components/PromptEnhancer'

type Tab = 'generate' | 'enhance'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('generate')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI 이미지 생성 POC
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          프롬프트를 입력하고 원하는 AI 모델을 선택하세요
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
              activeTab === 'generate'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            🎨 이미지 생성
          </button>
          <button
            onClick={() => setActiveTab('enhance')}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
              activeTab === 'enhance'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            ✨ 프롬프트 확장
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'generate' && <ImageGenerator />}
      {activeTab === 'enhance' && <PromptEnhancer />}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            🎭 LlamaGen
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            웹툰 스타일의 이미지를 생성합니다. 캐릭터와 만화 장면에 최적화되어 있습니다.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            🖼️ Nano Banana
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Google Gemini 기반 이미지 생성. 다양한 스타일의 이미지를 만들 수 있습니다.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            🎌 KusaPics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            애니메이션 스타일 이미지 생성. 웹 인터페이스를 통해 직접 조작할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
