import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import ZoomableImage from './ZoomableImage'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Mermaid from './Mermaid'
import ProjectThumbVideo from './ProjectThumbVideo'

export const components: MDXComponents = {
  Image,
  ZoomableImage,
  TOCInline,
  Mermaid,
  LoopVideo: ProjectThumbVideo,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
}
