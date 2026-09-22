import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PixelForge — Photo Editor',
  description: 'A powerful browser-based photo editor. Crop, resize, rotate, apply filters and adjustments — all locally, no uploads.',
  keywords: ['photo editor', 'image editor', 'crop', 'resize', 'filters', 'brightness', 'contrast'],
  authors: [{ name: 'Ryan Korir' }],
  openGraph: {
    title: 'PixelForge — Photo Editor',
    description: 'Powerful browser-based photo editing. No uploads, no server, 100% private.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0f11',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, overflow: 'hidden', height: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
