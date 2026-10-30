'use client'

import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

interface ShareLinksProps {
  path: string
  title?: string
}

export default function ShareLinks({ path, title }: ShareLinksProps) {
  const [copied, setCopied] = useState(false)
  const url = `${siteMetadata.siteUrl}/${path}`

  // Links posted to X or pasted from a native share arrive with no
  // referrer and would show as "Direct" in umami. Tag the shared URL so the
  // channel is attributed. utm_campaign is the page slug, so shares of
  // different pages stay distinguishable in the dashboard.
  const campaign = path.split('/').filter(Boolean).pop() || 'home'
  const shareUrl = (source: string, medium: string) => {
    const tagged = new URL(url)
    tagged.searchParams.set('utm_source', source)
    tagged.searchParams.set('utm_medium', medium)
    tagged.searchParams.set('utm_campaign', campaign)
    return tagged.toString()
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl('copy', 'share'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: shareUrl('native', 'share') })
    } else {
      await handleCopyLink()
    }
  }

  const handleShareToX = () => {
    const shared = shareUrl('x', 'social')
    const text = title ? `${title}` : ''
    const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(shared)}&text=${encodeURIComponent(text)}`
    window.open(xUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="prose-summary flex flex-wrap items-center gap-x-3 gap-y-1 pt-6 pb-6 text-sm">
      <button
        onClick={handleShareToX}
        data-umami-event="share-x"
        className="text-link inline-flex items-center gap-1"
      >
        <svg
          className="h-3.5 w-3.5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
        X
      </button>
      <span className="text-muted">·</span>
      <button onClick={handleShare} data-umami-event="share-native" className="text-link">
        Share
      </button>
      <span className="text-muted">·</span>
      <button onClick={handleCopyLink} data-umami-event="share-copy-link" className="text-link">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
