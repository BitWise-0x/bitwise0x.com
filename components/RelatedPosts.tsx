import Link from '@/components/Link'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  posts: CoreContent<Blog>[]
}

export default function RelatedPosts({ currentSlug, currentTags, posts }: RelatedPostsProps) {
  const related = posts
    .filter((post) => post.slug !== currentSlug && !post.draft)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentTags.includes(tag))
      return { ...post, sharedTagCount: sharedTags.length }
    })
    .filter((post) => post.sharedTagCount > 0)
    .sort((a, b) => {
      if (b.sharedTagCount !== a.sharedTagCount) return b.sharedTagCount - a.sharedTagCount
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <div className="related-posts">
      <h2 className="ledger-head">Related</h2>
      <ul>
        {related.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
