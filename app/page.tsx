import siteMetadata from '@/data/siteMetadata'
import ProjectsList from '@/components/ProjectsList'
import { versioned } from 'lib/asset'

export default async function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: siteMetadata.title,
        url: siteMetadata.siteUrl,
        description: siteMetadata.description,
        publisher: { '@id': `${siteMetadata.siteUrl}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${siteMetadata.siteUrl}/#organization`,
        name: 'BitWise',
        url: siteMetadata.siteUrl,
        logo: `${siteMetadata.siteUrl}${versioned('/static/images/logo.png')}`,
        sameAs: [siteMetadata.github, siteMetadata.x].filter(Boolean),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProjectsList title="Projects" />
    </>
  )
}
