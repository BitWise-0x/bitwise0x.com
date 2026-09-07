import projectsData from '@/data/projectsData'
import Image from '@/components/Image'
import Link from '@/components/Link'

const hostLabels: Record<string, string> = {
  'echosonic.io': 'EchoSonic.io',
  'carljung.ai': 'CarlJung.ai',
  'github.com': 'GitHub.com',
}

const getHostname = (url: string) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return hostLabels[host] || host
  } catch {
    return url
  }
}

export default function ProjectsList({ title = 'Projects' }: { title?: string }) {
  return (
    <div className="divide-theme divide-y">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="page-title">{title}</h1>
      </div>
      <ul className="divide-theme divide-y">
        {projectsData.map(({ title, tagline, description, imgSrc, href, learnMoreHref }) => {
          const thumbnail = imgSrc && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md sm:w-[280px]">
              <Image
                src={imgSrc}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className="object-cover object-center"
              />
            </div>
          )
          return (
            <li key={title} className="py-6 sm:py-12">
              <article className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                {thumbnail && (
                  <div className="order-2 shrink-0 sm:order-1">
                    {learnMoreHref ? (
                      <Link href={learnMoreHref} aria-hidden="true" tabIndex={-1}>
                        {thumbnail}
                      </Link>
                    ) : (
                      thumbnail
                    )}
                  </div>
                )}
                <div className="order-1 space-y-3 sm:order-2">
                  {tagline && (
                    <p className="eyebrow">{tagline}</p>
                  )}
                  <h2 className="text-2xl leading-8 font-bold tracking-tight">
                    {learnMoreHref ? (
                      <Link href={learnMoreHref} className="text-heading">
                        {title}
                      </Link>
                    ) : (
                      title
                    )}
                  </h2>
                  <div className="prose prose-summary max-w-none">{description}</div>
                  {(learnMoreHref || href) && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {learnMoreHref && (
                        <Link
                          href={learnMoreHref}
                          className="text-link text-base leading-6 font-medium"
                          aria-label={`Learn more about ${title}`}
                        >
                          Learn more &rarr;
                        </Link>
                      )}
                      {href && (
                        <Link
                          href={href}
                          className="text-link text-base leading-6 font-medium"
                          aria-label={`Visit ${title}`}
                        >
                          {getHostname(href)} &rarr;
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
