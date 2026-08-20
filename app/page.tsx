import siteMetadata from '@/data/siteMetadata'
import ProjectsList from '@/components/ProjectsList'

export default async function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: siteMetadata.title,
        url: siteMetadata.siteUrl,
        description: siteMetadata.description,
        publisher: {
          '@type': 'Person',
          name: siteMetadata.author,
          url: siteMetadata.siteUrl,
          sameAs: [siteMetadata.github, siteMetadata.x, siteMetadata.bluesky].filter(Boolean),
        },
      },
      {
        '@type': 'Organization',
        name: 'BitWise',
        url: siteMetadata.siteUrl,
        logo: `${siteMetadata.siteUrl}/static/images/social-banner.png`,
        sameAs: [siteMetadata.github, siteMetadata.x, siteMetadata.bluesky].filter(Boolean),
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
