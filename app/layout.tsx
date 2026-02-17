import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Ripple | Living Data for Lasting Impact',
    template: '%s | Ripple',
  },
  description: 'Modern donor management and multi-site analytics for nonprofits. AI-powered, zero manual entry, 100% free to start.',
  keywords: ['nonprofit', 'donor management', 'fundraising', 'CRM', 'AI', 'analytics'],
  authors: [{ name: 'Ripple Team' }],
  creator: 'Ripple Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ripple-platform.io',
    title: 'Ripple | Living Data for Lasting Impact',
    description: 'Modern donor management and multi-site analytics for nonprofits',
    siteName: 'Ripple Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ripple | Living Data for Lasting Impact',
    description: 'Modern donor management and multi-site analytics for nonprofits',
    creator: '@ripple_platform',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
