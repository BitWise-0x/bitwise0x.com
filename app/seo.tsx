import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

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
  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: pageUrl,
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
      creator: '@BitWise_0x',
    },
    ...(path &&
      !rest.alternates && {
        alternates: { canonical: pageUrl },
      }),
    ...rest,
  }
}
