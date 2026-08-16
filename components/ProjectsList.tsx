import projectsData from '@/data/projectsData'
import Card from '@/components/Card'

export default function ProjectsList({ title = 'Projects' }: { title?: string }) {
  return (
    <div className="divide-theme divide-y">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="page-title">{title}</h1>
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
              learnMoreHref={d.learnMoreHref}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
