import { MetadataRoute } from 'next'
import { slug } from 'github-slugger'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const publishedPosts = allBlogs.filter((post) => !post.draft)
  const blogRoutes = publishedPosts.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const latestPost = publishedPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0]
  const latestDate = latestPost?.date ?? new Date().toISOString().split('T')[0]

  const routes = ['', 'blog', 'projects', 'tags', 'about'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: latestDate,
  }))

  // a tag page changes when one of its posts does
  const tagRoutes = Object.keys(tagData as Record<string, number>).map((tag) => {
    const dates = publishedPosts
      .filter((post) => post.tags?.some((t) => slug(t) === tag))
      .map((post) => post.lastmod || post.date)
      .sort()
    return { url: `${siteUrl}/tags/${tag}`, lastModified: dates.at(-1) ?? latestDate }
  })

  return [...routes, ...blogRoutes, ...tagRoutes]
}
