import siteMetadata from '@/data/siteMetadata'
import ProjectsList from '@/components/ProjectsList'

export default async function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteMetadata.siteUrl}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
