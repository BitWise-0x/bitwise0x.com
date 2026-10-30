import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link href={`/tags/${slug(text)}`} className="pill">
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
