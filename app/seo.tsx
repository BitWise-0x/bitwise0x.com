import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { versioned } from 'lib/asset'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  path?: string
  alternates?: Metadata['alternates']
}

export function genPageMetadata({
  title,
  description,
  image,
  path,
  ...rest
}: PageSEOProps): Metadata {
  const pageUrl = path ? `${siteMetadata.siteUrl}/${path}` : siteMetadata.siteUrl
  // the generated cards and the banner are all 1200x630
  const ogImage = {
    url: versioned(image || siteMetadata.socialBanner),
    width: 1200,
    height: 630,
    alt: `${title} | ${siteMetadata.title}`,
  }
  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: pageUrl,
      siteName: siteMetadata.title,
      images: [ogImage],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: [ogImage],
      site: '@BitWise_0x',
      creator: '@BitWise_0x',
    },
    ...(path &&
      !rest.alternates && {
        alternates: { canonical: pageUrl },
      }),
    ...rest,
  }
}
