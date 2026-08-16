'use client'

import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'

const Header = () => {
  const pathname = usePathname()
  let headerClass = 'flex items-center w-full bg-page justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="w-[clamp(15.5rem,24vw,18rem)]">
            <Logo />
            <span className="text-muted mt-1 block text-left font-mono text-[0.625rem] font-medium tracking-[0.2em] uppercase md:text-xs">
              Intelligent Backends
            </span>
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-3xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link, index) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <div key={link.title} className="flex items-center">
                  {index > 0 && (
                    <span className="text-muted mx-3" aria-hidden="true">
                      |
                    </span>
                  )}
                  <Link
                    href={link.href}
                    className={`font-medium ${isActive ? 'text-primary-500' : 'text-heading'}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.title}
                  </Link>
                </div>
              )
            })}
        </div>
        <div className="hidden sm:block">
          <SearchButton />
        </div>
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
