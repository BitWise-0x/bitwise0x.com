import projectsData from '@/data/projectsData'
import Link from '@/components/Link'
import Image from '@/components/Image'

const getHost = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const isLive = (href?: string) => !!href && !getHost(href).includes('github.com')

const hostLabels: Record<string, string> = {
  'echosonic.io': 'EchoSonic.io',
  'carljung.ai': 'CarlJung.ai',
  'github.com': 'GitHub.com',
}

const friendlyHost = (href: string) => hostLabels[getHost(href)] || getHost(href)

export default function ProjectsList({ title = 'Projects' }: { title?: string }) {
  return (
    <div>
      <section className="ledger-lead ledger-hero">
        <p className="kicker">
          <span className="led-pulse" />
          {title}
        </p>
        <h1>
          Smart SaaS
          <br />
          <i>end to end</i>
        </h1>
        <p>Intelligent Backends</p>
      </section>

      <div className="ledger-head">
        <span>Project</span>
        <span>Status</span>
      </div>

      <ul className="records">
        {projectsData.map((project, i) => {
          const { title: name, tagline, description, imgSrc, href, learnMoreHref } = project
          const live = isLive(href)

          return (
            <li key={name} className={imgSrc ? 'record no-rid has-thumb' : 'record no-rid'}>
              {imgSrc && (
                <Link
                  href={learnMoreHref || href || '#'}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="record-thumb"
                >
                  <Image src={imgSrc} alt="" width={340} height={191} />
                </Link>
              )}

              <div>
                <h3>{learnMoreHref ? <Link href={learnMoreHref}>{name}</Link> : name}</h3>
                {tagline && <p className="tag">{tagline}</p>}
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

              <div className="side">
                <span className={live ? 'pill live' : 'pill oss'}>
                  {live ? 'Live' : 'Open source'}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
