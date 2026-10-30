import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import { Mail, Github, X, Bluesky } from '@/components/social-icons/icons'

export default function Footer() {
  const links = [
    { label: 'Email', href: `mailto:${siteMetadata.email}`, Icon: Mail },
    { label: 'GitHub', href: siteMetadata.github, Icon: Github },
    { label: 'X', href: siteMetadata.x, Icon: X },
    { label: 'Bluesky', href: siteMetadata.bluesky, Icon: Bluesky },
  ]

  return (
    <footer className="ledger-footer col-span-full mt-4 md:pl-9">
      <span>{`© BitWise · ${new Date().getFullYear()}`}</span>
      <span className="footer-links">
        {links
          .filter((l) => l.href)
          .map(({ label, href, Icon }) => (
            <Link key={label} href={href} aria-label={label}>
              <Icon className="icon" />
              <span>{label}</span>
            </Link>
          ))}
      </span>
    </footer>
  )
}
