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

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url })
    } else {
      await handleCopyLink()
    }
  }

  const handleShareToX = () => {
    const text = title ? `${title}` : ''
    const xUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    window.open(xUrl, '_blank', 'noopener,noreferrer')
  }

  const handleShareToBluesky = () => {
    const text = title ? `${title} ${url}` : url
    const bskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`
    window.open(bskyUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="prose-summary flex flex-wrap items-center gap-x-3 gap-y-1 pt-6 pb-6 text-sm">
      <button onClick={handleShareToX} className="text-link inline-flex items-center gap-1">
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
      <button onClick={handleShareToBluesky} className="text-link inline-flex items-center gap-1">
        <svg
          className="h-3.5 w-3.5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565C.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479c.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056q-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078c5.013 5.19 6.87-1.113 7.823-4.308c.953 3.195 2.05 9.271 7.733 4.308c4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364c.246-.828.624-5.79.624-6.478c0-.69-.139-1.861-.902-2.206c-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8" />
        </svg>
        Bluesky
      </button>
      <span className="text-muted">·</span>
      <button onClick={handleShare} className="text-link">
        Share
      </button>
      <span className="text-muted">·</span>
      <button onClick={handleCopyLink} className="text-link">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
