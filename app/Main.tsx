import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

const MAX_DISPLAY = 5

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  return (
    <>
      <div className="divide-theme divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="page-title">Latest</h1>
        </div>
        <ul className="divide-theme divide-y">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, heroImage } = post
            const showThumbnail = heroImage && !heroImage.includes('social-banner')
            return (
              <li key={slug} className="py-12">
                <article>
                  {/* Mobile: date + title before thumbnail */}
                  <div className="mb-3 sm:hidden">
                    <p className="text-muted text-base leading-6 font-medium">
                      <time dateTime={date} suppressHydrationWarning>
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                    </p>
                    <h2 className="mt-2 text-2xl leading-8 font-bold tracking-tight">
                      <Link href={`/blog/${slug}`} className="text-heading">
                        {title}
                      </Link>
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                    {showThumbnail && (
                      <Link
                        href={`/blog/${slug}`}
                        className="shrink-0"
                        aria-hidden="true"
                        tabIndex={-1}
                      >
                        <Image
                          src={heroImage}
                          alt=""
                          width={280}
                          height={158}
                          className="w-full rounded-md object-cover sm:w-[280px]"
                        />
                      </Link>
                    )}
                    <div className="space-y-3">
                      <dl className="hidden sm:block">
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-muted text-base leading-6 font-medium">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <h2 className="hidden text-2xl leading-8 font-bold tracking-tight sm:block">
                        <Link href={`/blog/${slug}`} className="text-heading">
                          {title}
                        </Link>
                      </h2>
                      <div className="flex flex-wrap">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <div className="prose prose-summary max-w-none">{summary}</div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-link"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link href="/blog" className="text-link" aria-label="All posts">
            All Posts &rarr;
          </Link>
        </div>
      )}
      {/* Newsletter form — requires Vercel (not static export) and BUTTONDOWN_API_KEY
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
      */}
    </>
  )
}
