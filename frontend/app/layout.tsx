import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI 이미지/웹툰 생성기',
  description: 'LLM 기반 AI 이미지 및 웹툰 생성 POC 프로젝트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                🎨 AI 이미지/웹툰 생성기
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                LLM 기반 이미지 생성 POC
              </p>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
