import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PixelForge — Free Online Photo Editor',
  description: 'Crop, resize, rotate, apply filters, adjust brightness & contrast — all in your browser. No uploads, no account, 100% free. Your photos never leave your device.',
  keywords: ['photo editor', 'image editor online', 'free photo editor', 'crop image online', 'resize image', 'photo filters', 'brightness contrast', 'no upload photo editor', 'browser photo editor'],
  authors: [{ name: 'Ryan Korir' }],
  openGraph: {
    title: 'PixelForge — Free Online Photo Editor',
    description: 'Professional photo editing in your browser. Crop, resize, rotate, filters, adjustments. No uploads, no account — 100% private.',
    type: 'website',
    siteName: 'PixelForge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PixelForge — Free Online Photo Editor',
    description: 'Crop, resize, rotate, apply filters — all in your browser. No uploads, no account, 100% private.',
  },
  robots: {
    index: true,
    follow: true,
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
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
