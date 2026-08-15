'use client'

import { useCallback, useRef } from 'react'

const MIN_SCALE = 1
const MAX_SCALE = 4

function getDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
}

// Shared pinch/pan/wheel/double-tap zoom logic for the lightbox dialogs used by
// ZoomableImage (raster images) and Mermaid (inline SVG charts). State is stored
// in refs to avoid re-rendering on every touch move.
export function useImageZoom() {
  const scaleRef = useRef(1)
  const translateRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const initialPinchDistance = useRef(0)
  const initialScale = useRef(1)
  const lastTapTime = useRef(0)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })

  const applyTransform = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const s = scaleRef.current
    const { x, y } = translateRef.current
    el.style.transform = `scale(${s}) translate(${x}px, ${y}px)`
  }, [])

  const resetZoom = useCallback(() => {
    scaleRef.current = 1
    translateRef.current = { x: 0, y: 0 }
    applyTransform()
  }, [applyTransform])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start
        isDragging.current = false
        initialPinchDistance.current = getDistance(e.touches[0], e.touches[1])
        initialScale.current = scaleRef.current
      } else if (e.touches.length === 1) {
        // Check for double-tap
        const now = Date.now()
        if (now - lastTapTime.current < 300) {
          // Double-tap: toggle between 1x and 2.5x
          e.preventDefault()
          if (scaleRef.current > 1) {
            scaleRef.current = 1
            translateRef.current = { x: 0, y: 0 }
          } else {
            scaleRef.current = 2.5
            // Zoom toward tap point
            const rect = containerRef.current?.getBoundingClientRect()
            if (rect) {
              const tapX = e.touches[0].clientX - rect.left - rect.width / 2
              const tapY = e.touches[0].clientY - rect.top - rect.height / 2
              translateRef.current = { x: -tapX * 0.6, y: -tapY * 0.6 }
            }
          }
          applyTransform()
          lastTapTime.current = 0
          return
        }
        lastTapTime.current = now

        // Single finger drag start (for panning when zoomed)
        if (scaleRef.current > 1) {
          isDragging.current = true
          dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
          translateStart.current = { ...translateRef.current }
        }
      }
    },
    [applyTransform]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch zoom
        e.preventDefault()
        const dist = getDistance(e.touches[0], e.touches[1])
        const ratio = dist / initialPinchDistance.current
        scaleRef.current = Math.min(MAX_SCALE, Math.max(MIN_SCALE, initialScale.current * ratio))
        if (scaleRef.current <= 1) {
          translateRef.current = { x: 0, y: 0 }
        }
        applyTransform()
      } else if (e.touches.length === 1 && isDragging.current && scaleRef.current > 1) {
        // Pan
        e.preventDefault()
        const dx = (e.touches[0].clientX - dragStart.current.x) / scaleRef.current
        const dy = (e.touches[0].clientY - dragStart.current.y) / scaleRef.current
        translateRef.current = {
          x: translateStart.current.x + dx,
          y: translateStart.current.y + dy,
        }
        applyTransform()
      }
    },
    [applyTransform]
  )

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
    // If pinch ended and scale went below 1, snap back
    if (scaleRef.current <= 1) {
      resetZoom()
    }
  }, [resetZoom])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleRef.current * delta))
      scaleRef.current = newScale
      if (newScale <= 1) {
        translateRef.current = { x: 0, y: 0 }
      }
      applyTransform()
    },
    [applyTransform]
  )

  return {
    containerRef,
    resetZoom,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  }
}
