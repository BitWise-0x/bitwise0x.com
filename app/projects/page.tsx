import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = genPageMetadata({
  title: 'Projects',
  description: 'Open-source projects and tools built by BitWise.',
  path: 'projects',
})

export default function Projects() {
  return (
    <>
      <div className="divide-theme divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="page-title">Projects</h1>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
