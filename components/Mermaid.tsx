'use client'

import { useCallback, useEffect, useRef, useState, Fragment } from 'react'
import mermaid from 'mermaid'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useImageZoom } from './useImageZoom'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#4ab3e8',
    primaryTextColor: '#c0caf5',
    primaryBorderColor: '#565f89',
    lineColor: '#565f89',
    secondaryColor: '#1c9ad6',
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
  const [svg, setSvg] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const {
    containerRef,
    resetZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  } = useImageZoom()

  useEffect(() => {
    const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
    mermaid.render(id, chart).then(async ({ svg }) => {
      const DOMPurify = (await import('dompurify')).default
      setSvg(
        DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true, html: true },
          ADD_TAGS: ['foreignObject'],
        })
      )
    })
  }, [chart])

  const open = useCallback(() => setIsOpen(true), [])

  const close = useCallback(() => {
    setIsOpen(false)
    resetZoom()
    setTimeout(() => buttonRef.current?.blur(), 0)
  }, [resetZoom])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        close()
      }
    },
    [close]
  )

  if (!svg) return null

  return (
    <div className="group relative my-6">
      <div
        className="flex justify-center overflow-x-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={open}
        className="focus-visible:ring-primary-500 absolute top-2 right-2 cursor-zoom-in rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity outline-none group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2"
        aria-label="Zoom diagram"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={close} className="relative">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="fixed inset-0 z-100 overflow-hidden" onClick={handleBackdropClick}>
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel className="w-full max-w-5xl">
                  <div
                    ref={containerRef}
                    className="origin-center rounded-lg bg-[#1a1b26] p-4 transition-transform duration-100 ease-out [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-none!"
                    style={{ touchAction: 'none' }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                </DialogPanel>
              </div>
            </div>
          </TransitionChild>

          <button
            onClick={close}
            className="fixed top-4 right-4 z-100 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Close zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Dialog>
      </Transition>
    </div>
  )
}
