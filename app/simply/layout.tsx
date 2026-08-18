import type { Metadata, Viewport } from 'next'
import './simply.css'

export const metadata: Metadata = {
  title: 'simply｜カメラと現像',
  description:
    'simply（シンプリー）は、撮ってすぐ整えるためのカメラアプリ。グリッド・セルフタイマー・ズーム・露出補正で撮り、落ち着いた10種のフィルターと10項目の調整、トリミングで仕上げます。',
  alternates: { canonical: '/simply' },
  openGraph: {
    title: 'simply｜カメラと現像',
    description: '撮る、整える。落ち着いた仕上がりのためのシンプルなカメラアプリ。',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    title: 'simply',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#0c0c0d',
  colorScheme: 'dark',
  viewportFit: 'cover',
}

export default function SimplyLayout({ children }: { children: React.ReactNode }) {
  return children
}
