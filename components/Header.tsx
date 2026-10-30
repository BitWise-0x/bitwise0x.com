'use client'

import { usePathname } from 'next/navigation'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SearchButton from './SearchButton'

export default function Header() {
  const pathname = usePathname()

  return (
    <aside className="rail">
      <Link href="/" aria-label="BitWise" className="mark">
        <span className="glyph">0x</span>
        <b>BitWise</b>
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

      <div className="status">
        <div className="row">
          <span>operator</span>
          <b>Rob</b>
        </div>
        <div className="row">
          <span>services</span>
          <b>
            <span className="led-pulse" />
            live
          </b>
        </div>
        <div className="row">
          <span>region</span>
          <b>bitwise0x.com</b>
        </div>
      </div>

      <div className="mt-5">
        <SearchButton />
      </div>
    </aside>
  )
}
