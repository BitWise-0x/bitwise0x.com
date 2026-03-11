import { allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = genPageMetadata({
  title: 'About',
  description:
    'About BitWise — the engineer behind the blog and the backend systems explored here.',
  path: 'about',
})

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default')
  if (!author) {
    return notFound()
  }
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
