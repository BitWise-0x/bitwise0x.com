'use client'

import { useEffect, useRef } from 'react'
import { versioned } from 'lib/asset'

const basePath = process.env.BASE_PATH || ''

// Plays only while on screen; with reduced motion it never loads and the poster stays.
export default function ProjectThumbVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // autoplay refused (data saver, low power mode): the poster stays up
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      poster={`${basePath}${versioned(`${src}.jpg`)}`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source
        src={`${basePath}${versioned(`${src}.av1.mp4`)}`}
        type='video/mp4; codecs="av01.0.04M.08"'
      />
      <source src={`${basePath}${versioned(`${src}.h264.mp4`)}`} type="video/mp4" />
    </video>
  )
}
