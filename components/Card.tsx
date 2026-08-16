import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
  learnMoreHref?: string
}

const getHostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

const Card = ({ title, description, imgSrc, href, learnMoreHref }: CardProps) => {
  const learnMore = learnMoreHref || href

  return (
    <div className="md max-w-[544px] px-4 py-8 md:w-1/2">
      <div className={`${imgSrc && 'h-full'} overflow-hidden`}>
        <div className="pb-4">
          <h2 className="text-2xl leading-8 font-bold tracking-tight">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          {href && (
            <Link
              href={href}
              className="text-link mt-1 inline-block text-sm font-medium uppercase"
              aria-label={`Link to ${title}`}
            >
              {getHostname(href)}
            </Link>
          )}
        </div>
        {imgSrc &&
          (href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              <Image
                alt={title}
                src={imgSrc}
                className="rounded-md object-cover object-center md:h-44 lg:h-56"
                width={544}
                height={306}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 544px"
              />
            </Link>
          ) : (
            <Image
              alt={title}
              src={imgSrc}
              className="rounded-md object-cover object-center md:h-44 lg:h-56"
              width={544}
              height={306}
            />
          ))}
        <div className="pt-4">
          <p className="prose prose-summary mb-3 max-w-none">{description}</p>
          {learnMore && (
            <Link
              href={learnMore}
              className="text-link text-base leading-6 font-medium"
              aria-label={`Learn more about ${title}`}
            >
              Learn more &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
