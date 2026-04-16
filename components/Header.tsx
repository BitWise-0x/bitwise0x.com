import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import { Github } from './social-icons/icons'

const Header = () => {
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
            <span className="text-muted mt-1 block text-left text-sm font-medium sm:text-base md:text-lg">
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
          <a
            href={siteMetadata.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-heading hover:text-primary-500 dark:hover:text-primary-500 flex items-center"
          >
            <Github className="h-5 w-5 fill-current" />
          </a>
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <div key={link.title} className="flex items-center">
                <span className="text-muted mx-3" aria-hidden="true">
                  |
                </span>
                <Link href={link.href} className="text-heading font-medium">
                  {link.title}
                </Link>
              </div>
            ))}
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
