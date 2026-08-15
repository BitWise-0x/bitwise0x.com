import ProjectsList from '@/components/ProjectsList'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = genPageMetadata({
  title: 'Projects',
  description: 'Open-source projects and tools built by BitWise.',
  path: 'projects',
})

export default function Projects() {
  return <ProjectsList />
}
