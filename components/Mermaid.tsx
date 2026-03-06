'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#7aa2f7',
    primaryTextColor: '#c0caf5',
    primaryBorderColor: '#565f89',
    lineColor: '#565f89',
    secondaryColor: '#bb9af7',
    tertiaryColor: '#1a1b26',
    background: '#1a1b26',
    mainBkg: '#1a1b26',
    nodeBorder: '#565f89',
    clusterBkg: '#16161e',
    clusterBorder: '#565f89',
    titleColor: '#c0caf5',
    edgeLabelBackground: '#1a1b26',
    nodeTextColor: '#c0caf5',
  },
  flowchart: { curve: 'basis', padding: 25, htmlLabels: false },
  fontFamily: 'ui-monospace, monospace',
})

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState('')

  useEffect(() => {
    const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
    mermaid.render(id, chart).then(async ({ svg }) => {
      const DOMPurify = (await import('dompurify')).default
      setSvg(
        DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          ADD_TAGS: ['foreignObject'],
        })
      )
    })
  }, [chart])

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
