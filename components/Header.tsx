'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SearchButton from './SearchButton'

export default function Header() {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  // publishes the header's live height as --nav-h, so in-page jumps land below it at any width
  useEffect(() => {
    const header = ref.current
    if (!header) return
    const root = document.documentElement
    const observer = new ResizeObserver(() => {
      const sticky = getComputedStyle(header).position === 'sticky'
      root.style.setProperty('--nav-h', sticky ? `${header.offsetHeight}px` : '0px')
    })
    observer.observe(header)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--nav-h')
    }
  }, [])

  return (
    <header ref={ref} className="topnav">
      <Link href="/" aria-label="BitWise" className="mark">
        <span className="glyph">0x</span>
        <span className="mark-text">
          <b>BitWise</b>
          <span className="mark-tagline">Intelligent Backends</span>
        </span>
      </Link>

      <div className="topnav-row">
        <nav aria-label="Primary">
          {headerNavLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`))
            return (
              <Link key={link.title} href={link.href} aria-current={isActive ? 'page' : undefined}>
                {link.title}
              </Link>
            )
          })}
        </nav>

        <div className="topnav-search">
          <SearchButton />
        </div>
      </div>
    </header>
  )
}
