import { ReactNode, SVGProps, ComponentType } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import Link from '@/components/Link'
import LedgerLead from '@/components/LedgerLead'
import { Mail, Github, X } from '@/components/social-icons/icons'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, github } = content

  const links: { label: string; href?: string; Icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
    { label: 'Email', href: email ? `mailto:${email}` : undefined, Icon: Mail },
    { label: 'GitHub', href: github, Icon: Github },
    { label: 'X', href: twitter, Icon: X },
  ]

  return (
    <div>
      <LedgerLead kicker="Operator" title="About">
        {occupation}
        {company ? ` · ${company}` : ''}
      </LedgerLead>

      <aside className="author-card">
        {avatar && <Image src={avatar} alt="" width={192} height={192} className="author-avatar" />}
        <div className="author-meta">
          <h3>{name}</h3>
          {company && <p className="tag">{company}</p>}
          <ul className="author-links">
            {links
              .filter((l) => l.href)
              .map(({ label, href, Icon }) => (
                <li key={label}>
                  <Link href={href as string}>
                    <Icon className="icon" />
                    {label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </aside>

      <div className="prose dark:prose-invert author-body max-w-none">{children}</div>
    </div>
  )
}
