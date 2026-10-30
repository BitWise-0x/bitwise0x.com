'use client'

import { usePathname } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SearchButton from './SearchButton'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="topnav">
      <Link href="/" aria-label="BitWise" className="mark">
        <span className="glyph">0x</span>
        <span className="mark-text">
          <b>BitWise</b>
          <span className="mark-tagline">Intelligent Backends</span>
        </span>
      </Link>

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
    </header>
  )
}
