import projectsData from '@/data/projectsData'
import Link from '@/components/Link'
import Image from '@/components/Image'
import LedgerLead from '@/components/LedgerLead'
import ProjectThumbVideo from '@/components/ProjectThumbVideo'

const getHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const hostLabels: Record<string, string> = {
  'echosonic.io': 'EchoSonic.io',
  'carljung.ai': 'CarlJung.ai',
  'fleetbit.co': 'FleetBit.co',
  'github.com': 'GitHub.com',
}

const friendlyHost = (href: string) => hostLabels[getHost(href)] || getHost(href)

export default function ProjectsList({ title = 'Projects' }: { title?: string }) {
  return (
    <div>
      <LedgerLead kicker="Work" title={title}>
        SaaS &amp; Open Source
      </LedgerLead>

      <ul className="records records-topline">
        {projectsData.map((project) => {
          const {
            title: name,
            tagline,
            description,
            imgSrc,
            videoSrc,
            href,
            learnMoreHref,
            comingSoon,
          } = project

          return (
            <li key={name} className={imgSrc ? 'record no-side has-thumb' : 'record no-side'}>
              {imgSrc && (
                <Link
                  href={learnMoreHref || href || '#'}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="record-thumb"
                >
                  {videoSrc ? (
                    <ProjectThumbVideo src={videoSrc} />
                  ) : (
                    <Image src={imgSrc} alt="" width={340} height={191} />
                  )}
                </Link>
              )}

              <div className="record-head">
                <h3>{learnMoreHref ? <Link href={learnMoreHref}>{name}</Link> : name}</h3>
                {tagline && <p className="tag">{tagline}</p>}
              </div>

              <div className="record-body">
                <p className="desc">{description}</p>
                {(learnMoreHref || href) && (
                  <div className="links">
                    {learnMoreHref && (
                      <Link
                        href={learnMoreHref}
                        data-umami-event="project-learn-more"
                        data-umami-event-project={name}
                      >
                        Read
                      </Link>
                    )}
                    {comingSoon && <span className="meta">Article coming soon</span>}
                    {href && (
                      <Link
                        href={href}
                        data-umami-event="project-visit"
                        data-umami-event-project={name}
                      >
                        {friendlyHost(href)}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
