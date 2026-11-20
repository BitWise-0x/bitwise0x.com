import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { versioned } from 'lib/asset'
import { ThemeProviders } from './theme-providers'
import { Metadata, Viewport } from 'next'

// page zoom stays off: zoom keys, Ctrl/Cmd with the wheel or trackpad pinch, Safari's gesture pinch
const NO_ZOOM = `addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && ["+", "=", "-", "_"].includes(e.key)) e.preventDefault(); });
addEventListener("wheel", (e) => { if (e.ctrlKey || e.metaKey) e.preventDefault(); }, { passive: false });
addEventListener("gesturestart", (e) => e.preventDefault());`

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | BitWise`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: versioned(siteMetadata.socialBanner),
        width: 1200,
        height: 630,
        alt: 'BitWise | Intelligent Backends',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [{ url: versioned(siteMetadata.socialBanner), alt: 'BitWise | Intelligent Backends' }],
    site: '@BitWise_0x',
    creator: '@BitWise_0x',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0c0f0e',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} ${ibm_plex_mono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${basePath}${versioned('/static/favicons/apple-touch-icon.png')}`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href={`${basePath}${versioned('/static/favicons/favicon-96x96.png')}`}
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href={`${basePath}${versioned('/static/favicons/favicon.svg')}`}
      />
      <link rel="manifest" href={`${basePath}${versioned('/static/favicons/site.webmanifest')}`} />
      <meta name="msapplication-TileColor" content="#0c0f0e" />
      <meta name="color-scheme" content="dark" />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={siteMetadata.title}
        href={`${basePath}/feed.xml`}
      />
      <script dangerouslySetInnerHTML={{ __html: NO_ZOOM }} />
      <body className="bg-page antialiased">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
            <div className="ledger-shell min-h-dvh">
              <Header />
              <main className="min-w-0 flex-1 py-9 md:py-12">{children}</main>
              <Footer />
            </div>
          </SearchProvider>
        </ThemeProviders>
      </body>
    </html>
  )
}
