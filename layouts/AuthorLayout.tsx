import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import Link from '@/components/Link'
import LedgerLead from '@/components/LedgerLead'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  const links: { label: string; href?: string }[] = [
    { label: 'email', href: email ? `mailto:${email}` : undefined },
    { label: 'github', href: github },
    { label: 'linkedin', href: linkedin },
    { label: 'x', href: twitter },
    { label: 'bluesky', href: bluesky },
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
          <dl className="author-links">
            {links
              .filter((l) => l.href)
              .map((l) => (
                <div className="row" key={l.label}>
                  <dt>{l.label}</dt>
                  <dd>
                    <Link href={l.href as string}>{l.href}</Link>
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      </aside>

      <div className="prose dark:prose-invert author-body max-w-none">{children}</div>
    </div>
  )
}
