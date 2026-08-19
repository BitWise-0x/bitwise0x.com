import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  tagline?: string
  description: string
  imgSrc?: string
  href?: string
  learnMoreHref?: string
}

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

const Card = ({ title, tagline, description, imgSrc, href, learnMoreHref }: CardProps) => {
  return (
    <div className="md max-w-[544px] p-4 md:w-1/2">
      <div className={`${imgSrc && 'h-full'} border-theme overflow-hidden rounded-md border-2`}>
        <div className="p-6 pb-4">
          <h2 className="text-2xl leading-8 font-bold tracking-tight">{title}</h2>
          {tagline && <p className="text-link mt-1 text-sm font-medium uppercase">{tagline}</p>}
        </div>
        {imgSrc && (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-44 lg:h-56"
            width={544}
            height={306}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 544px"
          />
        )}
        <div className="p-6 pt-4">
          <p className="prose prose-summary mb-3 max-w-none">{description}</p>
          {(learnMoreHref || href) && (
            <div className="flex items-center justify-between">
              {learnMoreHref ? (
                <Link
                  href={learnMoreHref}
                  className="text-link text-base leading-6 font-medium"
                  aria-label={`Learn more about ${title}`}
                >
                  Learn more &rarr;
                </Link>
              ) : (
                <span />
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
      </div>
    </div>
  )
}

export default Card
