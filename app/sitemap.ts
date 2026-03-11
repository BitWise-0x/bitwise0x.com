import { MetadataRoute } from 'next'
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

  const tagRoutes = Object.keys(tagData as Record<string, number>).map((tag) => ({
    url: `${siteUrl}/tags/${tag}`,
    lastModified: latestDate,
  }))

  return [...routes, ...blogRoutes, ...tagRoutes]
}
