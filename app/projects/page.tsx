import ProjectsList from '@/components/ProjectsList'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import type { Metadata } from 'next'

export const metadata: Metadata = genPageMetadata({
  title: 'Projects',
  description: 'Open-source projects and tools built by BitWise.',
  path: 'projects',
  // the home page renders the same list; search engines index it there
  alternates: { canonical: siteMetadata.siteUrl },
})

export default function Projects() {
  return <ProjectsList />
}
